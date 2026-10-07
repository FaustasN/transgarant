import { applyRules, checkLimits } from "./rules.js";

export const fieldLimits = {
  role: 50,
  name: 120,
  email: 254,
  message: 500,
};

export const maxCvSize = 5 * 1024 * 1024;

// Position ids accepted by the API; the browser derives the same ids from the page content.
export const roles = {
  "transport-manager": "Transporto vadybininkas (-ė)",
  "sales-manager": "Transporto paslaugų pardavimo vadybininkas (-ė)",
  "driver-forwarder": "Vairuotojas – ekspeditorius",
};

export function validateCv(cv, messages) {
  if (typeof cv?.arrayBuffer !== "function" || cv.size === 0) return messages.cvRequired;
  if (cv.size > maxCvSize) return messages.cvSize;
  if (cv.type !== "application/pdf" || !/\.pdf$/i.test(cv.name)) return messages.cvType;
}

// `jobIds` is a Set of valid position ids; `cv` is the uploaded File.
export function validateCareerForm(fields, cv, jobIds, messages) {
  const errors = checkLimits(fields, fieldLimits, ["role", "name", "email"], messages);

  if (fields.role && !jobIds.has(fields.role)) {
    errors.role = messages.role;
  }

  applyRules(fields, { email: "email", name: "name", message: "message" }, messages, errors);

  const cvError = validateCv(cv, messages);
  if (cvError) errors.cv = cvError;

  return errors;
}
