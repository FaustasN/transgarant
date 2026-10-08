import { Buffer } from "node:buffer";

import { composeEmail } from "@/lib/server/email";
import { baseMessages, createFormHandler } from "@/lib/server/formHandler";
import { fieldLimits, maxCvSize, roles, validateCareerForm } from "@/lib/validation/careers";

const messages = {
  ...baseMessages,
  role: "Select a valid position.",
  messageMin: "Message must contain at least 10 characters when provided.",
  invalidText: "Message contains unsupported characters.",
  cvRequired: "CV is required.",
  cvSize: "CV must be 5 MB or smaller.",
  cvType: "CV must be a PDF file.",
};
const jobIds = new Set(Object.keys(roles));

async function readCv(formData) {
  const cv = formData.get("cv");
  return { cv, bytes: Buffer.from(await cv.arrayBuffer()) };
}

function checkPdfContents(bytes) {
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") return "CV must be a valid PDF file.";
  if (!bytes.subarray(Math.max(0, bytes.length - 1024)).includes("%%EOF")) return "CV must be a complete PDF file.";
}

export const POST = createFormHandler({
  scope: "careers",
  maxSize: maxCvSize + 128 * 1024,
  contentType: "multipart/form-data",
  bodyMethod: "formData",
  oversizedError: "Application is too large.",
  fieldLimits,
  multiline: ["message"],
  invalidError: "Invalid career application data.",
  failureError: "Unable to send the career application.",
  async validate(fields, formData) {
    const errors = validateCareerForm(fields, formData.get("cv"), jobIds, messages);
    if (Object.keys(errors).length > 0) return errors;

    const cvError = checkPdfContents((await readCv(formData)).bytes);
    return cvError ? { cv: cvError } : {};
  },
  async compose(fields, formData) {
    const { cv, bytes } = await readCv(formData);
    const role = roles[fields.role];

    return composeEmail({
      subject: `Nauja kandidatūra: ${role}`,
      title: "Nauja darbo paraiška",
      replyTo: fields.email,
      groups: [
        [["Pozicija", role], ["Vardas ir pavardė", fields.name], ["El. paštas", fields.email]],
        [["Žinutė", fields.message || "Nenurodyta", true]],
        [["CV", cv.name]],
      ],
      attachments: [
        {
          filename: cv.name.replace(/[^\p{L}\p{N}._ -]/gu, "_") || "cv.pdf",
          content: bytes,
          contentType: "application/pdf",
        },
      ],
    });
  },
});
