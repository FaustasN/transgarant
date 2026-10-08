import {
  namePattern,
  phonePattern,
  controlCharacterPattern,
  isValidWeight,
} from "./rules.js";
import { toDateValue } from "./dates.js";

export const fieldLimits = {
  contactPerson: 120,
  phone: 11,
  loadingAddress: 200,
  unloadingAddress: 200,
  cargoType: 200,
  weight: 50,
  quantity: 200,
  pickupDate: 10,
};

export const requiredFields = [
  "contactPerson",
  "phone",
  "loadingAddress",
  "unloadingAddress",
  "cargoType",
  "weight",
];

export function validateQuoteForm(
  fields,
  validation,
  { today = toDateValue(new Date()), isValidDate } = {},
) {
  const errors = {};

  for (const field of requiredFields) {
    if (!fields[field]) {
      errors[field] = validation.required;
    }
  }

  for (const [field, limit] of Object.entries(fieldLimits)) {
    if (fields[field]?.length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (
    fields.contactPerson &&
    fields.contactPerson.replace(/\s/g, "").length < 3
  ) {
    errors.contactPerson = validation.nameMin;
  } else if (fields.contactPerson && !namePattern.test(fields.contactPerson)) {
    errors.contactPerson = validation.nameFormat;
  }

  if (fields.phone && !phonePattern.test(fields.phone)) {
    errors.phone = validation.phone;
  }

  for (const field of ["loadingAddress", "unloadingAddress"]) {
    if (fields[field] && fields[field].replace(/\s/g, "").length < 3) {
      errors[field] = validation.addressMin;
    } else if (fields[field] && controlCharacterPattern.test(fields[field])) {
      errors[field] = validation.addressInvalid ?? validation.invalidText;
    }
  }

  if (fields.cargoType && fields.cargoType.length < 2) {
    errors.cargoType = validation.cargoMin;
  } else if (
    fields.cargoType &&
    controlCharacterPattern.test(fields.cargoType)
  ) {
    errors.cargoType = validation.cargoInvalid ?? validation.invalidText;
  }

  if (fields.weight && !isValidWeight(fields.weight)) {
    errors.weight = validation.weight;
  }

  if (fields.quantity && controlCharacterPattern.test(fields.quantity)) {
    errors.quantity = validation.cargoInvalid ?? validation.invalidText;
  }

  if (fields.pickupDate) {
    if (isValidDate && !isValidDate(fields.pickupDate)) {
      errors.pickupDate = validation.date;
    } else if (fields.pickupDate < today) {
      errors.pickupDate = validation.pastDate;
    }
  }

  return errors;
}
