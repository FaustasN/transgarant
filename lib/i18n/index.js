import i18n from "i18next";
import { resources } from "./resources";

export { resources };

export function initI18n(locale = "lt") {
  if (!i18n.isInitialized) {
    i18n.init({
      resources,
      lng: locale,
      fallbackLng: "lt",
      ns: ["common", "about", "careers", "contact", "quote", "services"],
      defaultNS: "common",
      initImmediate: false,
      interpolation: {
        escapeValue: false,
      },
    });
  } else if (i18n.language !== locale) {
    i18n.changeLanguage(locale);
  }

  return i18n;
}
