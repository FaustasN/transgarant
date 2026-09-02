import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { mail, resetState } from "./api-support.mjs";

const { POST: contact } = await import("../app/api/contact/route.js");
const { POST: quote } = await import("../app/api/quote/route.js");
const { POST: careers } = await import("../app/api/careers/route.js");

beforeEach(resetState);

const contactFields = {
  name: "Jonas Jonaitis", email: "jonas@example.test", phone: "+3706123456",
  message: "Please contact me about transport.",
};
const quoteFields = {
  company: "UAB Transport", contactPerson: "Jonas Jonaitis", phone: "+3706123456",
  email: "jonas@example.test", loadingCountry: "Lietuva", loadingCity: "Vilnius",
  unloadingCountry: "France", unloadingCity: "Paris", cargoType: "Pallets",
  weight: "1,5 t", pickupDate: "", additionalInfo: "",
};
const careerFields = { role: "transport-manager", ...contactFields, message: "" };

function jsonRequest(fields, headers = {}) {
  return new Request("http://localhost/api/test", {
    method: "POST", headers: { "content-type": "application/json", ...headers },
    body: JSON.stringify(fields),
  });
}

function careerRequest({ fields = careerFields, body = "%PDF-1.7\n%%EOF", name = "cv.pdf", type = "application/pdf", omitCv = false } = {}) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  if (!omitCv) form.set("cv", new File([body], name, { type }));
  return new Request("http://localhost/api/careers", { method: "POST", body: form });
}

for (const [name, handler, contentType, limit, oversizedError] of [
  ["contact", contact, "application/json", 16 * 1024, "Request is too large."],
  ["quote", quote, "application/json", 32 * 1024, "Request is too large."],
  ["careers", careers, "multipart/form-data", 5 * 1024 * 1024 + 128 * 1024, "Application is too large."],
]) {
  test(`${name}: rejects unsupported types, oversized and malformed bodies before mail`, async () => {
    const wrongType = await handler(new Request("http://localhost", { method: "POST", body: "text" }));
    assert.equal(wrongType.status, 415);
    assert.deepEqual(await wrongType.json(), { error: `Content-Type must be ${contentType}.` });
    const oversized = await handler(new Request("http://localhost", {
      method: "POST", headers: { "content-type": contentType, "content-length": String(limit + 1) }, body: "{}",
    }));
    assert.equal(oversized.status, 413);
    assert.deepEqual(await oversized.json(), { error: oversizedError });
    const malformed = await handler(new Request("http://localhost", {
      method: "POST", headers: { "content-type": contentType }, body: "not a valid body",
    }));
    assert.equal(malformed.status, 400);
    assert.deepEqual(await malformed.json(), { error: "Invalid request body." });
    assert.equal(mail.messages.length, 0);
  });
}

test("contact normalizes text and escapes HTML without altering plain text", async () => {
  const response = await contact(jsonRequest({ ...contactFields, name: "  Ｊonas   Jonaitis  ", message: "  <script> & \"quote\" 'test'\r\nNext line  " }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  assert.equal(mail.messages.length, 1);
  const message = mail.messages[0];
  assert.equal(message.subject, "Nauja užklausa iš „Transgarant“ kontaktų formos");
  assert.equal(message.replyTo, "jonas@example.test");
  assert.equal(message.from, "sender@example.test");
  assert.equal(message.to, "recipient@example.test");
  assert.match(message.text, /Vardas ir pavardė: Jonas Jonaitis/);
  assert.match(message.text, /<script> & "quote" 'test'\nNext line/);
  assert.match(message.html, /&lt;script&gt; &amp; &quot;quote&quot; &#039;test&#039;<br>Next line/);
  assert.doesNotMatch(message.html, /<script>/);
});

test("contact rejects unsafe and mistyped fields with the existing error contract", async () => {
  const response = await contact(jsonRequest({ name: "Jo", email: "a..b@example.test", phone: "12345", message: "Hello there\u0000" }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    error: "Invalid contact form data.", fieldErrors: {
      name: "Name must contain at least 3 letters.", email: "Enter a valid email address.",
      phone: "Enter a phone number containing 9 to 10 digits.", message: "Message contains unsupported characters.",
    },
  });
  const missing = await contact(jsonRequest(null));
  assert.deepEqual((await missing.json()).fieldErrors, {
    name: "This field is required.", email: "This field is required.",
    phone: "This field is required.", message: "This field is required.",
  });
  assert.equal(mail.messages.length, 0);
});

test("quote accepts positive decimal weights and keeps optional placeholders in email", async () => {
  const response = await quote(jsonRequest(quoteFields));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  const message = mail.messages[0];
  assert.equal(message.subject, "Nauja transportavimo užklausa iš „Transgarant“ svetainės");
  assert.match(message.text, /Svoris: 1,5 t/);
  assert.match(message.text, /Pageidaujama pakrovimo data: Nenurodyta/);
  assert.match(message.text, /Papildoma informacija:\nNenurodyta/);
});

test("quote rejects impossible dates, past dates and zero weights", async () => {
  for (const [pickupDate, error] of [["2099-02-30", "Enter a valid date."], ["2020-01-01", "Pickup date cannot be in the past."]]) {
    const response = await quote(jsonRequest({ ...quoteFields, pickupDate, weight: "0 kg" }));
    assert.equal(response.status, 400);
    assert.deepEqual((await response.json()).fieldErrors, {
      weight: "Enter a positive weight with an optional kg or t unit.", pickupDate: error,
    });
  }
  assert.equal(mail.messages.length, 0);
});

test("careers requires a supported role and a nonempty PDF attachment", async () => {
  const response = await careers(careerRequest({ fields: { ...careerFields, role: "unknown" }, omitCv: true }));
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid career application data.", fieldErrors: { role: "Select a valid position.", cv: "CV is required." } });
  for (const options of [{ name: "cv.txt" }, { type: "text/plain" }, { body: "" }]) {
    const result = await careers(careerRequest(options));
    assert.equal(result.status, 400);
    assert.equal((await result.json()).fieldErrors.cv, options.body === "" ? "CV is required." : "CV must be a PDF file.");
  }
  assert.equal(mail.messages.length, 0);
});

test("careers enforces PDF size, signature and final EOF marker", async () => {
  for (const [body, error] of [
    [new Uint8Array(5 * 1024 * 1024 + 1), "CV must be 5 MB or smaller."],
    ["not PDF\n%%EOF", "CV must be a valid PDF file."],
    ["%PDF-1.7\nunfinished", "CV must be a complete PDF file."],
    ["%PDF-1.7\n%%EOF" + " ".repeat(1024), "CV must be a complete PDF file."],
  ]) {
    const response = await careers(careerRequest({ body }));
    assert.equal(response.status, 400);
    assert.equal((await response.json()).fieldErrors.cv, error);
  }
  assert.equal(mail.messages.length, 0);
});

test("careers attaches original PDF bytes with a sanitized filename", async () => {
  const response = await careers(careerRequest({ name: 'cv<script>.PDF' }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true });
  const message = mail.messages[0];
  assert.equal(message.subject, "Nauja kandidatūra: Transporto vadybininkas (-ė)");
  assert.match(message.text, /Žinutė:\nNenurodyta/);
  assert.match(message.html, /cv&lt;script&gt;.PDF/);
  assert.equal(message.attachments[0].filename, "cv_script_.PDF");
  assert.equal(message.attachments[0].content.toString(), "%PDF-1.7\n%%EOF");
  assert.equal(message.attachments[0].contentType, "application/pdf");
});

test("mail failures keep API-specific failure responses", async (t) => {
  mail.failure = new Error("Test transport unavailable");
  t.mock.method(console, "error", () => {});
  for (const [handler, request, error] of [
    [contact, jsonRequest(contactFields), "Unable to send the contact request."],
    [quote, jsonRequest(quoteFields), "Unable to send the quote request."],
    [careers, careerRequest(), "Unable to send the career application."],
  ]) {
    const response = await handler(request);
    assert.equal(response.status, 500);
    assert.deepEqual(await response.json(), { error });
  }
});

test("rate limits run before body parsing and remain isolated per endpoint", async () => {
  for (let attempt = 0; attempt < 5; attempt++) {
    assert.equal((await contact(jsonRequest(null))).status, 400);
  }
  const limited = await contact(jsonRequest(contactFields));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("x-ratelimit-remaining"), "0");
  assert.equal(limited.headers.get("cache-control"), "no-store");
  assert.equal((await quote(jsonRequest(quoteFields))).status, 200);
  assert.equal(mail.messages.length, 1);
});
