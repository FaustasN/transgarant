import "server-only";

import { escapeHtml } from "@/lib/server/html";

export function composeQuoteEmail(fields) {
  const pickupDate = fields.pickupDate || "Nenurodyta";
  const quantity = fields.quantity || "Nenurodyta";
  const text = [
    "Nauja transportavimo užklausa",
    "",
    `Kontaktinis asmuo: ${fields.contactPerson}`,
    `Telefono numeris: ${fields.phone}`,
    "",
    `Pakrovimo vieta: ${fields.loadingAddress}`,
    `Pristatymo vieta: ${fields.unloadingAddress}`,
    "",
    `Krovinio tipas: ${fields.cargoType}`,
    `Svoris: ${fields.weight}`,
    `Kiekis / matmenys: ${quantity}`,
    `Pageidaujama pakrovimo data: ${pickupDate}`,
  ].join("\n");
  const html = `
    <h2>Nauja transportavimo užklausa</h2>
    <p><strong>Kontaktinis asmuo:</strong> ${escapeHtml(fields.contactPerson)}</p>
    <p><strong>Telefono numeris:</strong> ${escapeHtml(fields.phone)}</p>
    <p><strong>Pakrovimo vieta:</strong> ${escapeHtml(fields.loadingAddress)}</p>
    <p><strong>Pristatymo vieta:</strong> ${escapeHtml(fields.unloadingAddress)}</p>
    <p><strong>Krovinio tipas:</strong> ${escapeHtml(fields.cargoType)}</p>
    <p><strong>Svoris:</strong> ${escapeHtml(fields.weight)}</p>
    <p><strong>Kiekis / matmenys:</strong> ${escapeHtml(quantity)}</p>
    <p><strong>Pageidaujama pakrovimo data:</strong> ${escapeHtml(pickupDate)}</p>
  `;

  return {
    subject: "Nauja transportavimo užklausa iš „Transgarant“ svetainės",
    text,
    html,
  };
}
