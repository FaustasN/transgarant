export const supportedLocales = ["lt", "en", "pl", "ru", "de", "fr"];

export const openGraphLocales = {
  lt: "lt_LT",
  en: "en_US",
  pl: "pl_PL",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
};

export const servicesSlugs = {
  lt: "paslaugos",
  en: "services",
  pl: "uslugi",
  ru: "uslugi",
  de: "dienstleistungen",
  fr: "services",
};

export const aboutSlugs = {
  lt: "apie-mus",
  en: "about-us",
  pl: "o-nas",
  ru: "o-kompanii",
  de: "ueber-uns",
  fr: "a-propos",
};

export const careersSlugs = {
  lt: "karjera",
  en: "careers",
  pl: "kariera",
  ru: "karera",
  de: "karriere",
  fr: "carrieres",
};

export const contactSlugs = {
  lt: "kontaktai",
  en: "contact",
  pl: "kontakt",
  ru: "kontakty",
  de: "kontakt",
  fr: "contact",
};

export const quoteSlugs = {
  lt: "uzklausa",
  en: "request-a-quote",
  pl: "zapytanie",
  ru: "zapros",
  de: "angebot-anfragen",
  fr: "demande-de-devis",
};

export function getServicesPath(locale = "lt") {
  const safeLocale = servicesSlugs[locale] ? locale : "lt";
  return `/${safeLocale}/${servicesSlugs[safeLocale]}`;
}

export function getAboutPath(locale = "lt") {
  const safeLocale = aboutSlugs[locale] ? locale : "lt";
  return `/${safeLocale}/${aboutSlugs[safeLocale]}`;
}

export function getCareersPath(locale = "lt") {
  const safeLocale = careersSlugs[locale] ? locale : "lt";
  return `/${safeLocale}/${careersSlugs[safeLocale]}`;
}

export function getContactPath(locale = "lt") {
  const safeLocale = contactSlugs[locale] ? locale : "lt";
  return `/${safeLocale}/${contactSlugs[safeLocale]}`;
}

export function getQuotePath(locale = "lt") {
  const safeLocale = quoteSlugs[locale] ? locale : "lt";
  return `/${safeLocale}/${quoteSlugs[safeLocale]}`;
}

export function getLocalizedPath(pathname, locale) {
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[1];

  if (Object.values(servicesSlugs).includes(currentSlug)) {
    return getServicesPath(locale);
  }

  if (Object.values(aboutSlugs).includes(currentSlug)) {
    return getAboutPath(locale);
  }

  if (Object.values(careersSlugs).includes(currentSlug)) {
    return getCareersPath(locale);
  }

  if (Object.values(contactSlugs).includes(currentSlug)) {
    return getContactPath(locale);
  }

  if (Object.values(quoteSlugs).includes(currentSlug)) {
    return getQuotePath(locale);
  }

  if (servicesSlugs[segments[0]]) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
