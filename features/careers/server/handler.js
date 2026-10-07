import "server-only";

import { Buffer } from "node:buffer";

import { sendMail } from "@/lib/server/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/server/rateLimit";
import { readField, readRequest } from "@/lib/server/request";
import { fieldLimits, maxCvSize } from "@/lib/validation/careers";
import { validateApplication } from "./validation.js";
import { composeCareerApplicationEmail } from "./email.js";

const maxRequestSize = maxCvSize + 128 * 1024;

export async function handlePost(request) {
  const rateLimit = checkRateLimit(request, "careers");

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  const { data: formData, response } = await readRequest(request, {
    maxSize: maxRequestSize,
    contentType: "multipart/form-data",
    bodyMethod: "formData",
    oversizedError: "Application is too large.",
  });

  if (response) {
    return response;
  }

  const fields = Object.fromEntries(
    Object.keys(fieldLimits).map((field) => [
      field,
      readField(formData.get(field), { multiline: field === "message" }),
    ]),
  );
  const cv = formData.get("cv");
  const fieldErrors = validateApplication(fields, cv);

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

  const email = composeCareerApplicationEmail(fields, cv, cvBuffer);

  try {
    await sendMail(email);

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
