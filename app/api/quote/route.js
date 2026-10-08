import { composeEmail } from "@/lib/server/email";
import { baseMessages, createFormHandler } from "@/lib/server/formHandler";
import { fieldLimits, validateQuoteForm } from "@/lib/validation/quote";
import { getTodayInVilnius, isValidDate } from "@/lib/validation/rules";

const messages = {
  ...baseMessages,
  addressMin: "Address must contain at least 3 characters.",
  addressInvalid: "Address contains unsupported characters.",
  cargoMin: "Cargo type must contain at least 2 characters.",
  cargoInvalid: "Cargo type contains unsupported characters.",
  weight: "Enter a positive weight with an optional kg or t unit.",
  date: "Enter a valid date.",
  pastDate: "Pickup date cannot be in the past.",
};

export const POST = createFormHandler({
  scope: "quote",
  maxSize: 32 * 1024,
  fieldLimits,
  invalidError: "Invalid quote form data.",
  failureError: "Unable to send the quote request.",
  validate: (fields) =>
    validateQuoteForm(fields, messages, { today: getTodayInVilnius(), isValidDate }),
  compose: (fields) =>
    composeEmail({
      subject: "Nauja transportavimo užklausa iš „Transgarant“ svetainės",
      title: "Nauja transportavimo užklausa",
      groups: [
        [["Kontaktinis asmuo", fields.contactPerson], ["Telefono numeris", fields.phone]],
        [["Pakrovimo vieta", fields.loadingAddress], ["Pristatymo vieta", fields.unloadingAddress]],
        [
          ["Krovinio tipas", fields.cargoType],
          ["Svoris", fields.weight],
          ["Kiekis / matmenys", fields.quantity || "Nenurodyta"],
          ["Pageidaujama pakrovimo data", fields.pickupDate || "Nenurodyta"],
        ],
      ],
    }),
});
