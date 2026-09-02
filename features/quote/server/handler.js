import "server-only";

import { sendMail } from "@/lib/server/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/server/rateLimit";
import { readField, readRequest } from "@/lib/server/request";
import { fieldLimits } from "@/lib/validation/quote";
import { validateQuoteForm } from "./validation.js";
import { composeQuoteEmail } from "./email.js";

const maxRequestSize = 32 * 1024;

export async function handlePost(request) {
  const rateLimit = checkRateLimit(request, "quote");

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  const { data: payload, response } = await readRequest(request, {
    maxSize: maxRequestSize,
  });

  if (response) {
    return response;
  }

  const fields = Object.fromEntries(
    Object.keys(fieldLimits).map((field) => [
      field,
      readField(payload?.[field], { multiline: field === "additionalInfo" }),
    ]),
  );
  const fieldErrors = validateQuoteForm(fields);

  if (Object.keys(fieldErrors).length > 0) {
    return Response.json(
      { error: "Invalid quote form data.", fieldErrors },
      { status: 400 },
    );
  }

  const email = composeQuoteEmail(fields);

  try {
    await sendMail(email);

    return Response.json({ success: true });
  } catch (error) {
    console.error(
      "Quote email failed:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return Response.json(
      { error: "Unable to send the quote request." },
      { status: 500 },
    );
  }
}
