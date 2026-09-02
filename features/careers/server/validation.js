import { validateCareerFields, maxCvSize } from "@/lib/validation/careers";
import { commonValidationMessages } from "@/lib/server/validationMessages";

export const roles = {
  "transport-manager": "Transporto vadybininkas (-ė)",
  "sales-manager": "Transporto paslaugų pardavimo vadybininkas (-ė)",
  "driver-forwarder": "Vairuotojas – ekspeditorius",
};

const messages = {
  ...commonValidationMessages,
  role: "Select a valid position.",
  messageMin: "Message must contain at least 10 characters when provided.",
  invalidText: "Message contains unsupported characters.",
};

export function validateApplication(fields) {
  return validateCareerFields(fields, messages, (role) => roles[role]);
}

export function validateCv(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return "CV is required.";
  }

  if (file.size > maxCvSize) {
    return "CV must be 5 MB or smaller.";
  }

  if (file.type !== "application/pdf" || !/\.pdf$/i.test(file.name)) {
    return "CV must be a PDF file.";
  }

  return null;
}
