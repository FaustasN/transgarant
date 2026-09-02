export { supportedLocales, openGraphLocales } from "./locales.mjs";

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

export const pageSlugs = {
  services: servicesSlugs,
  about: aboutSlugs,
  careers: careersSlugs,
  contact: contactSlugs,
  quote: quoteSlugs,
};

export function getPagePath(page, locale = "lt") {
  if (page === "home") return `/${locale}`;
  const slugs = pageSlugs[page];
  const safeLocale = slugs[locale] ? locale : "lt";
  return `/${safeLocale}/${slugs[safeLocale]}`;
}

export function getServicesPath(locale = "lt") {
  return getPagePath("services", locale);
}

export function getAboutPath(locale = "lt") {
  return getPagePath("about", locale);
}

export function getCareersPath(locale = "lt") {
  return getPagePath("careers", locale);
}

export function getContactPath(locale = "lt") {
  return getPagePath("contact", locale);
}

export function getQuotePath(locale = "lt") {
  return getPagePath("quote", locale);
}

export function getLocalizedPath(pathname, locale) {
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[1];

  for (const [page, slugs] of Object.entries(pageSlugs)) {
    if (Object.values(slugs).includes(currentSlug)) {
      return getPagePath(page, locale);
    }
  }

  if (servicesSlugs[segments[0]]) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
