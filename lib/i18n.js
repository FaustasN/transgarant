import i18n from "i18next";
import enAbout from "@/locales/en/about.json";
import enCareers from "@/locales/en/careers.json";
import enCommon from "@/locales/en/common.json";
import enContact from "@/locales/en/contact.json";
import enQuote from "@/locales/en/quote.json";
import enServices from "@/locales/en/services.json";
import ltCommon from "@/locales/lt/common.json";
import ltAbout from "@/locales/lt/about.json";
import ltCareers from "@/locales/lt/careers.json";
import ltServices from "@/locales/lt/services.json";
import ltContact from "@/locales/lt/contact.json";
import ltQuote from "@/locales/lt/quote.json";
import plAbout from "@/locales/pl/about.json";
import plCareers from "@/locales/pl/careers.json";
import plCommon from "@/locales/pl/common.json";
import plContact from "@/locales/pl/contact.json";
import plQuote from "@/locales/pl/quote.json";
import plServices from "@/locales/pl/services.json";
import ruAbout from "@/locales/ru/about.json";
import ruCareers from "@/locales/ru/careers.json";
import ruCommon from "@/locales/ru/common.json";
import ruContact from "@/locales/ru/contact.json";
import ruQuote from "@/locales/ru/quote.json";
import ruServices from "@/locales/ru/services.json";

export const resources = {
  en: {
    about: enAbout,
    careers: enCareers,
    common: enCommon,
    contact: enContact,
    quote: enQuote,
    services: enServices,
  },
  lt: {
    common: ltCommon,
    about: ltAbout,
    careers: ltCareers,
    services: ltServices,
    contact: ltContact,
    quote: ltQuote,
  },
  pl: {
    about: plAbout,
    careers: plCareers,
    common: plCommon,
    contact: plContact,
    quote: plQuote,
    services: plServices,
  },
  ru: {
    about: ruAbout,
    careers: ruCareers,
    common: ruCommon,
    contact: ruContact,
    quote: ruQuote,
    services: ruServices,
  },
};

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
