import { validateContactForm as validateFields } from "@/lib/validation/contact";
import { commonValidationMessages } from "@/lib/server/validationMessages";

const messages = {
  ...commonValidationMessages,
  messageMin: "Message must contain at least 10 characters.",
  invalidText: "Message contains unsupported characters.",
};

export function validateContactForm(fields) {
  return validateFields(fields, messages);
}
