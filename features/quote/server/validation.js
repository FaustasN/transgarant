import { validateQuoteForm as validateFields } from "@/lib/validation/quote";
import { getTodayInVilnius, isValidDate } from "@/lib/validation/dates";
import { commonValidationMessages } from "@/lib/server/validationMessages";

const messages = {
  ...commonValidationMessages,
  addressMin: "Address must contain at least 3 characters.",
  addressInvalid: "Address contains unsupported characters.",
  cargoMin: "Cargo type must contain at least 2 characters.",
  cargoInvalid: "Cargo type contains unsupported characters.",
  weight: "Enter a positive weight with an optional kg or t unit.",
  date: "Enter a valid date.",
  pastDate: "Pickup date cannot be in the past.",
};

export function validateQuoteForm(fields) {
  return validateFields(fields, messages, { today: getTodayInVilnius(), isValidDate });
}
