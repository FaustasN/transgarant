import {
  emailPattern,
  namePattern,
  phonePattern,
  controlCharacterPattern,
} from "./rules.js";

export const fieldLimits = {
  name: 120,
  email: 254,
  phone: 11,
  message: 500,
};

export function validateContactForm(fields, validation) {
  const errors = {};

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (!fields[field]) {
      errors[field] = validation.required;
    } else if (fields[field].length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = validation.email;
  }

  if (fields.name && fields.name.replace(/\s/g, "").length < 3) {
    errors.name = validation.nameMin;
  } else if (fields.name && !namePattern.test(fields.name)) {
    errors.name = validation.nameFormat;
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = validation.phone;
  }

  if (fields.message && fields.message.length < 10) {
    errors.message = validation.messageMin;
  } else if (fields.message && controlCharacterPattern.test(fields.message)) {
    errors.message = validation.invalidText;
  }

  return errors;
}
