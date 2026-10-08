export const supportedLocales = ["lt", "en", "pl", "ru", "de", "fr"];

export const openGraphLocales = {
  lt: "lt_LT",
  en: "en_US",
  pl: "pl_PL",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
};

export function getLocaleParams() {
  return supportedLocales.map((locale) => ({ locale }));
}
