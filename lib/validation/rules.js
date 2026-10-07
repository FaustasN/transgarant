const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const namePattern = /^[\p{L}\p{M}\s]+$/u;
const phonePattern = /^\+?\d{9,10}$/;
const weightPattern = /^(\d+(?:[.,]\d{1,3})?)\s*(kg|t)?$/i;

export const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function isValidWeight(value) {
  const match = weightPattern.exec(value);
  return Boolean(match && Number(match[1].replace(",", ".")) > 0);
}

// The browser and the server must normalize text identically, so both import this.
export function normalizeField(value, { multiline = false } = {}) {
  const normalized = String(value ?? "").normalize("NFKC").replace(/\r\n?/g, "\n").trim();
  return multiline ? normalized : normalized.replace(/\s+/g, " ");
}

// Each rule returns a message key's text for a non-empty value, or undefined when valid.
export const fieldRules = {
  name: (value, messages) => {
    if (value.replace(/\s/g, "").length < 3) return messages.nameMin;
    if (!namePattern.test(value)) return messages.nameFormat;
  },
  email: (value, messages) => {
    if (!emailPattern.test(value) || value.includes("..")) return messages.email;
  },
  phone: (value, messages) => {
    if (!phonePattern.test(value)) return messages.phone;
  },
  message: (value, messages) => {
    if (value.length < 10) return messages.messageMin;
    if (controlCharacterPattern.test(value)) return messages.invalidText;
  },
};

// Required and maximum-length checks shared by every form.
export function checkLimits(fields, limits, required, messages) {
  const errors = {};

  for (const [field, limit] of Object.entries(limits)) {
    if (required.includes(field) && !fields[field]) {
      errors[field] = messages.required;
    } else if (fields[field]?.length > limit) {
      errors[field] = messages.tooLong.replace("{max}", limit);
    }
  }

  return errors;
}

// Runs `{ field: ruleName }` in order over the fields that have a value.
export function applyRules(fields, rules, messages, errors) {
  for (const [field, rule] of Object.entries(rules)) {
    if (!fields[field]) continue;

    const error = fieldRules[rule](fields[field], messages);
    if (error) errors[field] = error;
  }

  return errors;
}

export function toDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isValidDate(value) {
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

export function getTodayInVilnius() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Vilnius",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
}
