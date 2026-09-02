import { Buffer } from "node:buffer";

import { sendMail } from "@/lib/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

const maxCvSize = 5 * 1024 * 1024;
const maxRequestSize = maxCvSize + 128 * 1024;
const fieldLimits = {
  role: 50,
  name: 120,
  email: 254,
  phone: 11,
  message: 500,
};
const roles = {
  "transport-manager": "Transporto vadybininkas (-ė)",
  "sales-manager": "Transporto paslaugų pardavimo vadybininkas (-ė)",
  "driver-forwarder": "Vairuotojas – ekspeditorius",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\p{M}\s]+$/u;
const phonePattern = /^\+?\d{9,10}$/;
const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

function readField(value, { multiline = false } = {}) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.normalize("NFKC").replace(/\r\n?/g, "\n").trim();
  return multiline ? normalized : normalized.replace(/\s+/g, " ");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}

function validateApplication(fields) {
  const errors = {};

  for (const field of ["role", "name", "email", "phone"]) {
    if (!fields[field]) {
      errors[field] = "This field is required.";
    }
  }

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (fields[field].length > limit) {
      errors[field] = `This field must be ${limit} characters or fewer.`;
    }
  }

  if (fields.role && !roles[fields.role]) {
    errors.role = "Select a valid position.";
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (fields.name && fields.name.replace(/\s/g, "").length < 3) {
    errors.name = "Name must contain at least 3 letters.";
  } else if (fields.name && !namePattern.test(fields.name)) {
    errors.name = "Name may contain letters and spaces only.";
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = "Enter a phone number containing 9 to 10 digits.";
  }

  if (fields.message && fields.message.length < 10) {
    errors.message = "Message must contain at least 10 characters when provided.";
  } else if (fields.message && controlCharacterPattern.test(fields.message)) {
    errors.message = "Message contains unsupported characters.";
  }

  return errors;
}

function validateCv(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return "CV is required.";
  }

  if (file.size > maxCvSize) {
    return "CV must be 5 MB or smaller.";
  }

  if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name)) {
    return "CV must be a PDF file.";
  }

  return null;
}

function sanitizeFilename(filename) {
  const sanitized = filename.replace(/[^\p{L}\p{N}._ -]/gu, "_");
  return sanitized || "cv.pdf";
}

export async function POST(request) {
  const rateLimit = checkRateLimit(request, "careers");

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  if (!request.headers.get("content-type")?.startsWith("multipart/form-data")) {
    return Response.json(
      { error: "Content-Type must be multipart/form-data." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxRequestSize) {
    return Response.json(
      { error: "Application is too large." },
      { status: 413 },
    );
  }

  let formData;

  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fields = Object.fromEntries(
    Object.keys(fieldLimits).map((field) => [
      field,
      readField(formData.get(field), { multiline: field === "message" }),
    ]),
  );
  const cv = formData.get("cv");
  const fieldErrors = validateApplication(fields);
  const cvError = validateCv(cv);

  if (cvError) {
    fieldErrors.cv = cvError;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: "Invalid career application data.", fieldErrors },
      { status: 400 },
    );
  }

  const cvBuffer = Buffer.from(await cv.arrayBuffer());

  if (cvBuffer.subarray(0, 5).toString("ascii") !== "%PDF-") {
    return Response.json(
      {
        error: "Invalid career application data.",
        fieldErrors: { cv: "CV must be a valid PDF file." },
      },
      { status: 400 },
    );
  }

  if (!cvBuffer.subarray(Math.max(0, cvBuffer.length - 1024)).includes("%%EOF")) {
    return Response.json(
      {
        error: "Invalid career application data.",
        fieldErrors: { cv: "CV must be a complete PDF file." },
      },
      { status: 400 },
    );
  }

  const role = roles[fields.role];
  const message = fields.message || "Nenurodyta";
  const text = [
    "Nauja darbo paraiška",
    "",
    `Pozicija: ${role}`,
    `Vardas ir pavardė: ${fields.name}`,
    `El. paštas: ${fields.email}`,
    `Telefono numeris: ${fields.phone}`,
    "",
    "Žinutė:",
    message,
    "",
    `CV: ${cv.name}`,
  ].join("\n");
  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const html = `
    <h2>Nauja darbo paraiška</h2>
    <p><strong>Pozicija:</strong> ${escapeHtml(role)}</p>
    <p><strong>Vardas ir pavardė:</strong> ${escapeHtml(fields.name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Telefono numeris:</strong> ${escapeHtml(fields.phone)}</p>
    <p><strong>Žinutė:</strong><br>${messageHtml}</p>
    <p><strong>CV:</strong> ${escapeHtml(cv.name)}</p>
  `;

  try {
    await sendMail({
      subject: `Nauja kandidatūra: ${role}`,
      text,
      html,
      replyTo: fields.email,
      attachments: [
        {
          filename: sanitizeFilename(cv.name),
          content: cvBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(
      "Career application email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      { error: "Unable to send the career application." },
      { status: 500 },
    );
  }
}
