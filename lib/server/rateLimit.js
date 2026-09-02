import "server-only";

const defaultLimit = 5;
const defaultWindowMs = 10 * 60 * 1000;
const cleanupIntervalMs = 60 * 1000;
const maxEntries = 10000;

const rateLimitState = globalThis.__transgarantRateLimitState ?? {
  entries: new Map(),
  lastCleanup: 0,
};

globalThis.__transgarantRateLimitState = rateLimitState;

function getClientIdentifier(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function cleanupExpiredEntries(now) {
  if (now - rateLimitState.lastCleanup < cleanupIntervalMs) {
    return;
  }

  for (const [key, entry] of rateLimitState.entries) {
    if (entry.resetAt <= now) {
      rateLimitState.entries.delete(key);
    }
  }

  rateLimitState.lastCleanup = now;
}

export function checkRateLimit(
  request,
  scope,
  { limit = defaultLimit, windowMs = defaultWindowMs } = {},
) {
  const now = Date.now();
  const key = `${scope}:${getClientIdentifier(request)}`;

  cleanupExpiredEntries(now);

  let entry = rateLimitState.entries.get(key);

  if (!entry || entry.resetAt <= now) {
    if (rateLimitState.entries.size >= maxEntries) {
      const oldestKey = rateLimitState.entries.keys().next().value;
      rateLimitState.entries.delete(oldestKey);
    }

    entry = { count: 0, resetAt: now + windowMs };
    rateLimitState.entries.set(key, entry);
  }

  const allowed = entry.count < limit;

  if (allowed) {
    entry.count += 1;
  }

  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
    retryAfter: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
  };
}

export function createRateLimitResponse(result) {
  return Response.json(
    { error: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Cache-Control": "no-store",
        "Retry-After": String(result.retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
        "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
      },
    },
  );
}
