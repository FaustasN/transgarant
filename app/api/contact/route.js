import { composeEmail } from "@/lib/server/email";
import { baseMessages, createFormHandler } from "@/lib/server/formHandler";
import { fieldLimits, validateContactForm } from "@/lib/validation/contact";

const messages = {
  ...baseMessages,
  messageMin: "Message must contain at least 10 characters.",
  invalidText: "Message contains unsupported characters.",
};

export const POST = createFormHandler({
  scope: "contact",
  maxSize: 16 * 1024,
  fieldLimits,
  multiline: ["message"],
  invalidError: "Invalid contact form data.",
  failureError: "Unable to send the contact request.",
  validate: (fields) => validateContactForm(fields, messages),
  compose: (fields) =>
    composeEmail({
      subject: "Nauja užklausa iš „Transgarant“ kontaktų formos",
      title: "Nauja žinutė iš kontaktų formos",
      replyTo: fields.email,
      groups: [
        [["Vardas ir pavardė", fields.name], ["El. paštas", fields.email]],
        [["Žinutė", fields.message, true]],
      ],
    }),
});
