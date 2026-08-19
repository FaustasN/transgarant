import i18n from "i18next";
import enAbout from "@/locales/en/about.json";
import enCareers from "@/locales/en/careers.json";
import enCommon from "@/locales/en/common.json";
import enContact from "@/locales/en/contact.json";
import enQuote from "@/locales/en/quote.json";
import enServices from "@/locales/en/services.json";
import deAbout from "@/locales/de/about.json";
import deCareers from "@/locales/de/careers.json";
import deCommon from "@/locales/de/common.json";
import deContact from "@/locales/de/contact.json";
import deQuote from "@/locales/de/quote.json";
import deServices from "@/locales/de/services.json";
import frAbout from "@/locales/fr/about.json";
import frCareers from "@/locales/fr/careers.json";
import frCommon from "@/locales/fr/common.json";
import frContact from "@/locales/fr/contact.json";
import frQuote from "@/locales/fr/quote.json";
import frServices from "@/locales/fr/services.json";
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
  de: {
    about: deAbout,
    careers: deCareers,
    common: deCommon,
    contact: deContact,
    quote: deQuote,
    services: deServices,
  },
  en: {
    about: enAbout,
    careers: enCareers,
    common: enCommon,
    contact: enContact,
    quote: enQuote,
    services: enServices,
  },
  fr: {
    about: frAbout,
    careers: frCareers,
    common: frCommon,
    contact: frContact,
    quote: frQuote,
    services: frServices,
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
