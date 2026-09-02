import "server-only";

import { sendMail } from "@/lib/server/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/server/rateLimit";
import { readField, readRequest } from "@/lib/server/request";
import { validateContactForm } from "./validation.js";
import { composeContactEmail } from "./email.js";

const maxRequestSize = 16 * 1024;

export async function handlePost(request) {
  const rateLimit = checkRateLimit(request, "contact");

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  const { data: payload, response } = await readRequest(request, {
    maxSize: maxRequestSize,
  });

  if (response) {
    return response;
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

  const email = composeContactEmail(fields);

  try {
    await sendMail(email);

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
