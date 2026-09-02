import {
  emailPattern,
  namePattern,
  phonePattern,
  controlCharacterPattern,
} from "./rules.js";

export const fieldLimits = {
  role: 50,
  name: 120,
  email: 254,
  phone: 11,
  message: 500,
};

export const maxCvSize = 5 * 1024 * 1024;

export function validateCareerFields(fields, validation, isValidRole) {
  const errors = {};

  for (const field of ["role", "name", "email", "phone"]) {
    if (!fields[field]) {
      errors[field] = validation.required;
    }
  }

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (fields[field].length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (fields.role && !isValidRole(fields.role)) {
    errors.role = validation.role;
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

export function validateCareerForm(fields, cv, jobIds, validation) {
  const errors = validateCareerFields(fields, validation, (role) => jobIds.has(role));

  if (!(cv instanceof File) || cv.size === 0) {
    errors.cv = validation.cvRequired;
  } else if (cv.size > maxCvSize) {
    errors.cv = validation.cvSize;
  } else if (cv.type !== "application/pdf" || !/\.pdf$/i.test(cv.name)) {
    errors.cv = validation.cvType;
  }

  return errors;
}
