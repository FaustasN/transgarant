import "server-only";

import { escapeHtml } from "@/lib/server/html";

export function composeContactEmail(fields) {
  const text = [
    "Nauja žinutė iš kontaktų formos",
    "",
    `Vardas ir pavardė: ${fields.name}`,
    `El. paštas: ${fields.email}`,
    "",
    "Žinutė:",
    fields.message,
  ].join("\n");
  const messageHtml = escapeHtml(fields.message).replace(/\r?\n/g, "<br>");
  const html = `
    <h2>Nauja žinutė iš kontaktų formos</h2>
    <p><strong>Vardas ir pavardė:</strong> ${escapeHtml(fields.name)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Žinutė:</strong><br>${messageHtml}</p>
  `;

  return {
    subject: "Nauja užklausa iš „Transgarant“ kontaktų formos",
    text,
    html,
    replyTo: fields.email,
  };
}
