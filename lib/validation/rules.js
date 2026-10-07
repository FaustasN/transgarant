export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const namePattern = /^[\p{L}\p{M}\s]+$/u;
export const phonePattern = /^\+?\d{9,10}$/;
export const weightPattern = /^(\d+(?:[.,]\d{1,3})?)\s*(kg|t)?$/i;
export const controlCharacterPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

export function isValidWeight(value) {
  const match = weightPattern.exec(value);
  return Boolean(match && Number(match[1].replace(",", ".")) > 0);
}
