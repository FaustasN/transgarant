import { roles, validateCareerForm } from "@/lib/validation/careers";
import { commonValidationMessages } from "@/lib/server/validationMessages";

export { roles };

const messages = {
  ...commonValidationMessages,
  role: "Select a valid position.",
  messageMin: "Message must contain at least 10 characters when provided.",
  invalidText: "Message contains unsupported characters.",
  cvRequired: "CV is required.",
  cvSize: "CV must be 5 MB or smaller.",
  cvType: "CV must be a PDF file.",
};

const jobIds = new Set(Object.keys(roles));

export function validateApplication(fields, cv) {
  return validateCareerForm(fields, cv, jobIds, messages);
}
