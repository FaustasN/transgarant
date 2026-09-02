import "server-only";

import { escapeHtml } from "@/lib/server/html";

export function composeQuoteEmail(fields) {
  const pickupDate = fields.pickupDate || "Nenurodyta";
  const additionalInfo = fields.additionalInfo || "Nenurodyta";
  const text = [
    "Nauja transportavimo užklausa",
    "",
    `Įmonė: ${fields.company}`,
    `Kontaktinis asmuo: ${fields.contactPerson}`,
    `Telefono numeris: ${fields.phone}`,
    `El. paštas: ${fields.email}`,
    "",
    `Pakrovimo vieta: ${fields.loadingCity}, ${fields.loadingCountry}`,
    `Pristatymo vieta: ${fields.unloadingCity}, ${fields.unloadingCountry}`,
    "",
    `Krovinio tipas: ${fields.cargoType}`,
    `Svoris: ${fields.weight}`,
    `Pageidaujama pakrovimo data: ${pickupDate}`,
    "",
    "Papildoma informacija:",
    additionalInfo,
  ].join("\n");
  const additionalInfoHtml = escapeHtml(additionalInfo).replace(
    /\r?\n/g,
    "<br>",
  );
  const html = `
    <h2>Nauja transportavimo užklausa</h2>
    <p><strong>Įmonė:</strong> ${escapeHtml(fields.company)}</p>
    <p><strong>Kontaktinis asmuo:</strong> ${escapeHtml(fields.contactPerson)}</p>
    <p><strong>Telefono numeris:</strong> ${escapeHtml(fields.phone)}</p>
    <p><strong>El. paštas:</strong> ${escapeHtml(fields.email)}</p>
    <p><strong>Pakrovimo vieta:</strong> ${escapeHtml(fields.loadingCity)}, ${escapeHtml(fields.loadingCountry)}</p>
    <p><strong>Pristatymo vieta:</strong> ${escapeHtml(fields.unloadingCity)}, ${escapeHtml(fields.unloadingCountry)}</p>
    <p><strong>Krovinio tipas:</strong> ${escapeHtml(fields.cargoType)}</p>
    <p><strong>Svoris:</strong> ${escapeHtml(fields.weight)}</p>
    <p><strong>Pageidaujama pakrovimo data:</strong> ${escapeHtml(pickupDate)}</p>
    <p><strong>Papildoma informacija:</strong><br>${additionalInfoHtml}</p>
  `;

  return {
    subject: "Nauja transportavimo užklausa iš „Transgarant“ svetainės",
    text,
    html,
    replyTo: fields.email,
  };
}
