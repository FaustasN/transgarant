import {
  emailPattern,
  namePattern,
  phonePattern,
  companyPattern,
  locationPattern,
  controlCharacterPattern,
  isValidWeight,
} from "./rules.js";
import { toDateValue } from "./dates.js";

export const fieldLimits = {
  company: 150,
  contactPerson: 120,
  phone: 11,
  email: 254,
  loadingCountry: 100,
  loadingCity: 100,
  unloadingCountry: 100,
  unloadingCity: 100,
  cargoType: 200,
  weight: 50,
  pickupDate: 10,
  additionalInfo: 500,
};

const requiredFields = [
  "company",
  "contactPerson",
  "phone",
  "email",
  "loadingCountry",
  "loadingCity",
  "unloadingCountry",
  "unloadingCity",
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
    if (fields[field].length > limit) {
      errors[field] = validation.tooLong.replace("{max}", limit);
    }
  }

  if (
    fields.email &&
    (!emailPattern.test(fields.email) || fields.email.includes(".."))
  ) {
    errors.email = validation.email;
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

  if (fields.company && fields.company.replace(/\s/g, "").length < 2) {
    errors.company = validation.companyMin;
  } else if (fields.company && !companyPattern.test(fields.company)) {
    errors.company = validation.companyFormat;
  }

  for (const field of [
    "loadingCountry",
    "loadingCity",
    "unloadingCountry",
    "unloadingCity",
  ]) {
    if (fields[field] && fields[field].replace(/\s/g, "").length < 2) {
      errors[field] = validation.locationMin;
    } else if (fields[field] && !locationPattern.test(fields[field])) {
      errors[field] = validation.locationFormat;
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

  if (fields.pickupDate) {
    if (isValidDate && !isValidDate(fields.pickupDate)) {
      errors.pickupDate = validation.date;
    } else if (fields.pickupDate < today) {
      errors.pickupDate = validation.pastDate;
    }
  }

  if (
    fields.additionalInfo &&
    controlCharacterPattern.test(fields.additionalInfo)
  ) {
    errors.additionalInfo = validation.additionalInfoInvalid ?? validation.invalidText;
  }

  return errors;
}
