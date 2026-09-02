import { validateQuoteForm as validateFields } from "@/lib/validation/quote";
import { getTodayInVilnius, isValidDate } from "@/lib/validation/dates";
import { commonValidationMessages } from "@/lib/server/validationMessages";

const messages = {
  ...commonValidationMessages,
  companyMin: "Company name must contain at least 2 characters.",
  companyFormat: "Company name contains unsupported characters.",
  locationMin: "Location must contain at least 2 letters.",
  locationFormat: "Use letters, spaces, apostrophes and hyphens only.",
  cargoMin: "Cargo type must contain at least 2 characters.",
  cargoInvalid: "Cargo type contains unsupported characters.",
  weight: "Enter a positive weight with an optional kg or t unit.",
  date: "Enter a valid date.",
  pastDate: "Pickup date cannot be in the past.",
  additionalInfoInvalid: "Additional information contains unsupported characters.",
};

export function validateQuoteForm(fields) {
  return validateFields(fields, messages, { today: getTodayInVilnius(), isValidDate });
}
