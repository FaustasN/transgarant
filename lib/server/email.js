import "server-only";

const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" };

export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

// `groups` is a list of row lists; each row is [label, value, multiline?].
// The plain-text body separates groups with a blank line, the HTML body lists the rows.
export function composeEmail({ subject, title, groups, replyTo, attachments }) {
  const text = [
    title,
    ...groups.map((rows) =>
      rows.map(([label, value, multiline]) => (multiline ? `${label}:\n${value}` : `${label}: ${value}`)).join("\n"),
    ),
  ].join("\n\n");
  const html = [
    `<h2>${title}</h2>`,
    ...groups.flat().map(([label, value, multiline]) => {
      const content = multiline ? `<br>${escapeHtml(value).replace(/\r?\n/g, "<br>")}` : ` ${escapeHtml(value)}`;
      return `<p><strong>${label}:</strong>${content}</p>`;
    }),
  ].join("\n    ");

  return { subject, text, html: `\n    ${html}\n  `, replyTo, attachments };
}
