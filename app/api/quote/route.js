import { sendMail } from "@/lib/mailer";
import { checkRateLimit, createRateLimitResponse } from "@/lib/rateLimit";

const maxRequestSize = 32 * 1024;
const fieldLimits = {
  company: 150,
  contactPerson: 120,
  phone: 11,
  email: 254,
  loadingCountry: 100,
  loadingCity: 100,
  unloadingCountry: 100,
  unloadingCity: 100,
  cargoType: 200,
  weight: 50,
  pickupDate: 10,
  additionalInfo: 500,
};

const requiredFields = [
  "company",
  "contactPerson",
  "phone",
  "email",
  "loadingCountry",
  "loadingCity",
  "unloadingCountry",
  "unloadingCity",
  "cargoType",
  "weight",
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\p{M}\s]+$/u;
const phonePattern = /^\+?\d{9,10}$/;
const companyPattern = /^[\p{L}\p{M}\p{N}\s&.,'’"()\/-]+$/u;
const locationPattern = /^[\p{L}\p{M}\s'’-]+$/u;
const weightPattern = /^(\d+(?:[.,]\d{1,3})?)\s*(kg|t)?$/i;
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

function isValidDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const [, year, month, day] = match.map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function getTodayInVilnius() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}

function isValidWeight(value) {
  const match = weightPattern.exec(value);
  return Boolean(match && Number(match[1].replace(",", ".")) > 0);
}

function validateQuoteForm(fields) {
  const errors = {};

  for (const field of requiredFields) {
    if (!fields[field]) {
      errors[field] = "This field is required.";
    }
  }

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (fields[field].length > limit) {
      errors[field] = `This field must be ${limit} characters or fewer.`;
    }
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (
    fields.contactPerson &&
    fields.contactPerson.replace(/\s/g, "").length < 3
  ) {
    errors.contactPerson = "Name must contain at least 3 letters.";
  } else if (fields.contactPerson && !namePattern.test(fields.contactPerson)) {
    errors.contactPerson = "Name may contain letters and spaces only.";
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = "Enter a phone number containing 9 to 10 digits.";
  }

  if (fields.company && fields.company.replace(/\s/g, "").length < 2) {
    errors.company = "Company name must contain at least 2 characters.";
  } else if (fields.company && !companyPattern.test(fields.company)) {
    errors.company = "Company name contains unsupported characters.";
  }

  for (const field of [
    "loadingCountry",
    "loadingCity",
    "unloadingCountry",
    "unloadingCity",
  ]) {
    if (fields[field] && fields[field].replace(/\s/g, "").length < 2) {
      errors[field] = "Location must contain at least 2 letters.";
    } else if (fields[field] && !locationPattern.test(fields[field])) {
      errors[field] = "Use letters, spaces, apostrophes and hyphens only.";
    }
  }

  if (fields.cargoType && fields.cargoType.length < 2) {
    errors.cargoType = "Cargo type must contain at least 2 characters.";
  } else if (
    fields.cargoType &&
    controlCharacterPattern.test(fields.cargoType)
  ) {
    errors.cargoType = "Cargo type contains unsupported characters.";
  }

  if (fields.weight && !isValidWeight(fields.weight)) {
    errors.weight = "Enter a positive weight with an optional kg or t unit.";
  }

  if (fields.pickupDate) {
    if (!isValidDate(fields.pickupDate)) {
      errors.pickupDate = "Enter a valid date.";
    } else if (fields.pickupDate < getTodayInVilnius()) {
      errors.pickupDate = "Pickup date cannot be in the past.";
    }
  }

  if (
    fields.additionalInfo &&
    controlCharacterPattern.test(fields.additionalInfo)
  ) {
    errors.additionalInfo = "Additional information contains unsupported characters.";
  }

  return errors;
}

export async function POST(request) {
  const rateLimit = checkRateLimit(request, "quote");

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

  const pickupDate = fields.pickupDate || "Nenurodyta";
  const additionalInfo = fields.additionalInfo || "Nenurodyta";
  const text = [
    "Nauja transportavimo užklausa",
    "",
    `Įmonė: ${fields.company}`,
    `Kontaktinis asmuo: ${fields.contactPerson}`,
    `Telefono numeris: ${fields.phone}`,
    `El. paštas: ${fields.email}`,
    "",
    `Pakrovimo vieta: ${fields.loadingCity}, ${fields.loadingCountry}`,
    `Pristatymo vieta: ${fields.unloadingCity}, ${fields.unloadingCountry}`,
    "",
    `Krovinio tipas: ${fields.cargoType}`,
    `Svoris: ${fields.weight}`,
    `Pageidaujama pakrovimo data: ${pickupDate}`,
    "",
    "Papildoma informacija:",
    additionalInfo,
  ].join("\n");
  const additionalInfoHtml = escapeHtml(additionalInfo).replace(
    /\r?\n/g,
    "<br>",
  );
  const html = `
    <h2>Nauja transportavimo užklausa</h2>
    <p><strong>Įmonė:</strong> ${escapeHtml(fields.company)}</p>
    <p><strong>Kontaktinis asmuo:</strong> ${escapeHtml(fields.contactPerson)}</p>
    <p><strong>Telefono numeris:</strong> ${escapeHtml(fields.phone)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Pakrovimo vieta:</strong> ${escapeHtml(fields.loadingCity)}, ${escapeHtml(fields.loadingCountry)}</p>
    <p><strong>Pristatymo vieta:</strong> ${escapeHtml(fields.unloadingCity)}, ${escapeHtml(fields.unloadingCountry)}</p>
    <p><strong>Krovinio tipas:</strong> ${escapeHtml(fields.cargoType)}</p>
    <p><strong>Svoris:</strong> ${escapeHtml(fields.weight)}</p>
    <p><strong>Pageidaujama pakrovimo data:</strong> ${escapeHtml(pickupDate)}</p>
    <p><strong>Papildoma informacija:</strong><br>${additionalInfoHtml}</p>
  `;

  try {
    await sendMail({
      subject: "Nauja transportavimo užklausa iš „Transgarant“ svetainės",
      text,
      html,
      replyTo: fields.email,
    });

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
