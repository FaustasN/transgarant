import { sendMail } from "@/lib/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

const maxRequestSize = 16 * 1024;
const fieldLimits = {
  name: 120,
  email: 254,
  phone: 11,
  message: 500,
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

function validateContactForm(fields) {
  const errors = {};

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (!fields[field]) {
      errors[field] = "This field is required.";
    } else if (fields[field].length > limit) {
      errors[field] = `This field must be ${limit} characters or fewer.`;
    }
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
    errors.message = "Message must contain at least 10 characters.";
  } else if (fields.message && controlCharacterPattern.test(fields.message)) {
    errors.message = "Message contains unsupported characters.";
  }

  return errors;
}

export async function POST(request) {
  const rateLimit = checkRateLimit(request, "contact");

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return Response.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const contentLength = Number(request.headers.get("content-length"));

  if (Number.isFinite(contentLength) && contentLength > maxRequestSize) {
    return Response.json({ error: "Request is too large." }, { status: 413 });
  }

  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fields = {
    name: readField(payload?.name),
    email: readField(payload?.email),
    phone: readField(payload?.phone),
    message: readField(payload?.message, { multiline: true }),
  };
  const fieldErrors = validateContactForm(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: "Invalid contact form data.", fieldErrors },
      { status: 400 },
    );
  }

  const text = [
    "Nauja žinutė iš kontaktų formos",
    "",
    `Vardas ir pavardė: ${fields.name}`,
    `El. paštas: ${fields.email}`,
    `Telefono numeris: ${fields.phone}`,
    "",
    "Žinutė:",
    fields.message,
  ].join("\n");
  const messageHtml = escapeHtml(fields.message).replace(/\r?\n/g, "<br>");
  const html = `
    <h2>Nauja žinutė iš kontaktų formos</h2>
    <p><strong>Vardas ir pavardė:</strong> ${escapeHtml(fields.name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Telefono numeris:</strong> ${escapeHtml(fields.phone)}</p>
    <p><strong>Žinutė:</strong><br>${messageHtml}</p>
  `;

  try {
    await sendMail({
      subject: "Nauja užklausa iš „Transgarant“ kontaktų formos",
      text,
      html,
      replyTo: fields.email,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(
      "Contact email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      { error: "Unable to send the contact request." },
      { status: 500 },
    );
  }
}
