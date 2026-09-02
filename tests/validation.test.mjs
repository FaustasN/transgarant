import assert from "node:assert/strict";
import { test } from "node:test";
import "./api-support.mjs";

const { validateContactForm } = await import("../lib/validation/contact.js");
const { validateQuoteForm } = await import("../lib/validation/quote.js");
const { validateCareerForm } = await import("../lib/validation/careers.js");
const { isValidDate, getTodayInVilnius } = await import("../lib/validation/dates.js");

const messages = {
  required: "required", tooLong: "maximum {max}", email: "email", nameMin: "name minimum",
  nameFormat: "name format", phone: "phone", messageMin: "message minimum", invalidText: "invalid text",
  role: "role", cvRequired: "CV required", cvSize: "CV size", cvType: "CV type",
  companyMin: "company minimum", companyFormat: "company format", locationMin: "location minimum",
  locationFormat: "location format", cargoMin: "cargo minimum", weight: "weight", pastDate: "past date", date: "invalid date",
};
const contact = { name: "Živilė Jonaitė", email: "zivile@example.test", phone: "123456789", message: "Ten letters or more" };
const quote = {
  company: "UAB Name", contactPerson: contact.name, email: contact.email, phone: contact.phone,
  loadingCountry: "Lietuva", loadingCity: "Vilnius", unloadingCountry: "France", unloadingCity: "Paris",
  cargoType: "Pallets", weight: "1,25 t", pickupDate: "", additionalInfo: "",
};

test("contact shares Unicode, length and email rules while using supplied messages", () => {
  assert.deepEqual(validateContactForm(contact, messages), {});
  assert.deepEqual(validateContactForm({ ...contact, name: "Jo", email: "a..b@example.test", phone: "12345678", message: "small" }, messages), {
    name: "name minimum", email: "email", phone: "phone", message: "message minimum",
  });
  assert.equal(validateContactForm({ ...contact, message: "a".repeat(501) }, messages).message, "maximum 500");
  assert.equal(validateContactForm({ ...contact, message: "hello world\u0000" }, messages).message, "invalid text");
});

test("quote keeps browser dates permissive and allows stricter server date validation", () => {
  const fields = { ...quote, pickupDate: "2099-02-30" };
  assert.deepEqual(validateQuoteForm(fields, messages, { today: "2026-09-02" }), {});
  assert.deepEqual(validateQuoteForm(fields, messages, { today: "2026-09-02", isValidDate }), { pickupDate: "invalid date" });
  assert.deepEqual(validateQuoteForm({ ...quote, pickupDate: "2026-09-01" }, messages, { today: "2026-09-02" }), { pickupDate: "past date" });
});

test("quote validates company, locations and positive weight without widening accepted formats", () => {
  assert.deepEqual(validateQuoteForm(quote, messages), {});
  for (const weight of ["0", "0 kg", "-1 t", "1.1234 kg", "2 pounds", "1e3"]) {
    assert.equal(validateQuoteForm({ ...quote, weight }, messages).weight, "weight");
  }
  assert.deepEqual(validateQuoteForm({ ...quote, company: "Company<script>", loadingCity: "A1", cargoType: "x" }, messages), {
    company: "company format", loadingCity: "location format", cargoType: "cargo minimum",
  });
});

test("career browser validation keeps optional message and File checks", () => {
  const fields = { ...contact, role: "driver-forwarder", message: "" };
  const roles = new Set(["driver-forwarder"]);
  const cv = new File(["PDF bytes"], "resume.PDF", { type: "application/pdf" });
  assert.deepEqual(validateCareerForm(fields, cv, roles, messages), {});
  assert.equal(validateCareerForm(fields, { size: 5, name: "cv.pdf", type: "application/pdf" }, roles, messages).cv, "CV required");
  assert.equal(validateCareerForm(fields, new File(["x"], "cv.pdf", { type: "text/plain" }), roles, messages).cv, "CV type");
  assert.equal(validateCareerForm(fields, new File([new Uint8Array(5 * 1024 * 1024 + 1)], "cv.pdf", { type: "application/pdf" }), roles, messages).cv, "CV size");
  assert.deepEqual(validateCareerForm({ ...fields, role: "unknown", message: "short" }, cv, roles, messages), { role: "role", message: "message minimum" });
});

test("server dates reject rollover dates and use Vilnius calendar boundaries", (t) => {
  assert.equal(isValidDate("2028-02-29"), true);
  for (const value of ["2027-02-29", "2026-04-31", "2026-13-01", "2026-9-2"]) assert.equal(isValidDate(value), false);
  t.mock.timers.enable({ apis: ["Date"], now: new Date("2026-09-01T21:30:00Z") });
  assert.equal(getTodayInVilnius(), "2026-09-02");
});
