import {
  applyRules,
  checkLimits,
  controlCharacterPattern,
  isValidWeight,
  toDateValue,
} from "./rules.js";

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
  messages,
  { today = toDateValue(new Date()), isValidDate } = {},
) {
  const errors = checkLimits(fields, fieldLimits, requiredFields, messages);

  applyRules(fields, { contactPerson: "name", phone: "phone" }, messages, errors);

  for (const field of ["loadingAddress", "unloadingAddress"]) {
    if (fields[field] && fields[field].replace(/\s/g, "").length < 3) {
      errors[field] = messages.addressMin;
    } else if (fields[field] && controlCharacterPattern.test(fields[field])) {
      errors[field] = messages.addressInvalid ?? messages.invalidText;
    }
  }

  if (fields.cargoType && fields.cargoType.length < 2) {
    errors.cargoType = messages.cargoMin;
  } else if (fields.cargoType && controlCharacterPattern.test(fields.cargoType)) {
    errors.cargoType = messages.cargoInvalid ?? messages.invalidText;
  }

  if (fields.weight && !isValidWeight(fields.weight)) {
    errors.weight = messages.weight;
  }

  if (fields.quantity && controlCharacterPattern.test(fields.quantity)) {
    errors.quantity = messages.cargoInvalid ?? messages.invalidText;
  }

  if (fields.pickupDate) {
    if (isValidDate && !isValidDate(fields.pickupDate)) {
      errors.pickupDate = messages.date;
    } else if (fields.pickupDate < today) {
      errors.pickupDate = messages.pastDate;
    }
  }

  return errors;
}
