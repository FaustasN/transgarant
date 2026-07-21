import i18n from "i18next";
import enCommon from "@/locales/en/common.json";
import ltCommon from "@/locales/lt/common.json";
import plCommon from "@/locales/pl/common.json";
import ruCommon from "@/locales/ru/common.json";

export const resources = {
  en: {
    common: enCommon,
  },
  lt: {
    common: ltCommon,
  },
  pl: {
    common: plCommon,
  },
  ru: {
    common: ruCommon,
  },
};

export function initI18n(locale = "lt") {
  if (!i18n.isInitialized) {
    i18n.init({
      resources,
      lng: locale,
      fallbackLng: "lt",
      ns: ["common"],
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
