import { applyRules, checkLimits } from "./rules.js";

export const fieldLimits = {
  name: 120,
  email: 254,
  message: 500,
};

export function validateContactForm(fields, messages) {
  const errors = checkLimits(fields, fieldLimits, Object.keys(fieldLimits), messages);

  return applyRules(fields, { email: "email", name: "name", message: "message" }, messages, errors);
}
