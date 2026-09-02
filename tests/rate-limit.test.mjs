import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { resetState } from "./api-support.mjs";

const { checkRateLimit, createRateLimitResponse } = await import("../lib/server/rateLimit.js");
beforeEach(resetState);

const request = (headers = {}) => new Request("http://localhost", { headers });

test("five requests consume the default window and the sixth returns retry headers", async (t) => {
  t.mock.method(Date, "now", () => 1_800_000_000_000);
  for (let index = 0; index < 5; index++) {
    const result = checkRateLimit(request(), "contact");
    assert.equal(result.allowed, true);
    assert.equal(result.remaining, 4 - index);
  }
  const result = checkRateLimit(request(), "contact");
  assert.deepEqual(result, { allowed: false, limit: 5, remaining: 0, resetAt: 1_800_000_600_000, retryAfter: 600 });
  const response = createRateLimitResponse(result);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "600");
  assert.equal(response.headers.get("X-RateLimit-Reset"), "1800000600");
  assert.deepEqual(await response.json(), { error: "Too many requests. Please try again later." });
});

test("client identifiers and endpoint scopes have independent budgets", () => {
  const options = { limit: 1 };
  assert.equal(checkRateLimit(request({ "x-forwarded-for": "192.0.2.1, 192.0.2.2" }), "contact", options).allowed, true);
  assert.equal(checkRateLimit(request({ "x-forwarded-for": "192.0.2.1, 192.0.2.3" }), "contact", options).allowed, false);
  assert.equal(checkRateLimit(request({ "x-real-ip": "192.0.2.1" }), "contact", options).allowed, false);
  assert.equal(checkRateLimit(request({ "x-real-ip": "192.0.2.2" }), "contact", options).allowed, true);
  assert.equal(checkRateLimit(request({ "x-real-ip": "192.0.2.1" }), "quote", options).allowed, true);
});

test("the exact window boundary resets the request budget", (t) => {
  let now = 1_800_000_000_000;
  t.mock.method(Date, "now", () => now);
  const options = { limit: 1, windowMs: 1500 };
  assert.equal(checkRateLimit(request(), "contact", options).allowed, true);
  now += 1499;
  const blocked = checkRateLimit(request(), "contact", options);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.retryAfter, 1);
  now += 1;
  assert.equal(checkRateLimit(request(), "contact", options).allowed, true);
});
