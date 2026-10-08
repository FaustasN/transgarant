import "server-only";

import { sendMail } from "@/lib/server/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/server/rateLimit";
import { normalizeField } from "@/lib/validation/rules";

// English validation messages returned by the API (the browser uses translated ones).
export const baseMessages = {
  required: "This field is required.",
  tooLong: "This field must be {max} characters or fewer.",
  email: "Enter a valid email address.",
  nameMin: "Name must contain at least 3 letters.",
  nameFormat: "Name may contain letters and spaces only.",
  phone: "Enter a phone number containing 9 to 10 digits.",
};

function readField(value, { multiline = false } = {}) {
  return typeof value === "string" ? normalizeField(value, { multiline }) : "";
}

async function readRequest(request, { maxSize, contentType, bodyMethod, oversizedError }) {
  if (!request.headers.get("content-type")?.startsWith(contentType)) {
    return { response: Response.json({ error: `Content-Type must be ${contentType}.` }, { status: 415 }) };
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxSize) {
    return { response: Response.json({ error: oversizedError }, { status: 413 }) };
  }

  try {
    return { data: await request[bodyMethod]() };
  } catch {
    return { response: Response.json({ error: "Invalid request body." }, { status: 400 }) };
  }
}

/**
 * Builds a POST handler: rate limit, read the body, normalize the fields named in
 * `fieldLimits`, validate, compose the email and send it.
 *
 * - validate(fields, data) returns an object of field errors (may be async)
 * - compose(fields, data) returns the message passed to sendMail (may be async)
 */
export function createFormHandler({
  scope,
  maxSize,
  contentType = "application/json",
  bodyMethod = "json",
  oversizedError = "Request is too large.",
  fieldLimits,
  multiline = [],
  invalidError,
  failureError,
  validate,
  compose,
}) {
  return async function POST(request) {
    const rateLimit = checkRateLimit(request, scope);

    if (!rateLimit.allowed) {
      return createRateLimitResponse(rateLimit);
    }

    const { data, response } = await readRequest(request, { maxSize, contentType, bodyMethod, oversizedError });

    if (response) {
      return response;
    }

    const fields = Object.fromEntries(
      Object.keys(fieldLimits).map((field) => [
        field,
        readField(data instanceof FormData ? data.get(field) : data?.[field], {
          multiline: multiline.includes(field),
        }),
      ]),
    );
    const fieldErrors = await validate(fields, data);

    if (Object.keys(fieldErrors).length > 0) {
      return Response.json({ error: invalidError, fieldErrors }, { status: 400 });
    }

    try {
      await sendMail(await compose(fields, data));

      return Response.json({ success: true });
    } catch (error) {
      console.error(`${scope} email failed:`, error instanceof Error ? error.message : "Unknown error");

      return Response.json({ error: failureError }, { status: 500 });
    }
  };
}
