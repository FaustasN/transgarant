import "server-only";

export function readField(value, { multiline = false } = {}) {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value.normalize("NFKC").replace(/\r\n?/g, "\n").trim();
  return multiline ? normalized : normalized.replace(/\s+/g, " ");
}

export async function readRequest(
  request,
  {
    maxSize,
    contentType = "application/json",
    bodyMethod = "json",
    oversizedError = "Request is too large.",
  },
) {
  if (!request.headers.get("content-type")?.startsWith(contentType)) {
    return {
      response: Response.json(
        { error: `Content-Type must be ${contentType}.` },
        { status: 415 },
      ),
    };
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > maxSize) {
    return {
      response: Response.json({ error: oversizedError }, { status: 413 }),
    };
  }

  try {
    return { data: await request[bodyMethod]() };
  } catch {
    return {
      response: Response.json({ error: "Invalid request body." }, { status: 400 }),
    };
  }
}
