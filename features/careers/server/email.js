import "server-only";

import { escapeHtml } from "@/lib/server/html";
import { roles } from "./validation.js";

function sanitizeFilename(filename) {
  const sanitized = filename.replace(/[^\p{L}\p{N}._ -]/gu, "_");
  return sanitized || "cv.pdf";
}

export function composeCareerApplicationEmail(fields, cv, cvBuffer) {
  const role = roles[fields.role];
  const message = fields.message || "Nenurodyta";
  const text = [
    "Nauja darbo paraiška",
    "",
    `Pozicija: ${role}`,
    `Vardas ir pavardė: ${fields.name}`,
    `El. paštas: ${fields.email}`,
    "",
    "Žinutė:",
    message,
    "",
    `CV: ${cv.name}`,
  ].join("\n");
  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");
  const html = `
    <h2>Nauja darbo paraiška</h2>
    <p><strong>Pozicija:</strong> ${escapeHtml(role)}</p>
    <p><strong>Vardas ir pavardė:</strong> ${escapeHtml(fields.name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Žinutė:</strong><br>${messageHtml}</p>
    <p><strong>CV:</strong> ${escapeHtml(cv.name)}</p>
  `;

  return {
    subject: `Nauja kandidatūra: ${role}`,
    text,
    html,
    replyTo: fields.email,
    attachments: [
      {
        filename: sanitizeFilename(cv.name),
        content: cvBuffer,
        contentType: "application/pdf",
      },
    ],
  };
}
