export const supportedLocales = ["lt", "en", "pl", "ru", "de", "fr"];

export const openGraphLocales = {
  lt: "lt_LT",
  en: "en_US",
  pl: "pl_PL",
  ru: "ru_RU",
  de: "de_DE",
  fr: "fr_FR",
};

export const pageSlugs = {
  services: {
    lt: "paslaugos",
    en: "services",
    pl: "uslugi",
    ru: "uslugi",
    de: "dienstleistungen",
    fr: "services",
  },
  about: {
    lt: "apie-mus",
    en: "about-us",
    pl: "o-nas",
    ru: "o-kompanii",
    de: "ueber-uns",
    fr: "a-propos",
  },
  careers: {
    lt: "karjera",
    en: "careers",
    pl: "kariera",
    ru: "karera",
    de: "karriere",
    fr: "carrieres",
  },
  contact: {
    lt: "kontaktai",
    en: "contact",
    pl: "kontakt",
    ru: "kontakty",
    de: "kontakt",
    fr: "contact",
  },
  quote: {
    lt: "uzklausa",
    en: "request-a-quote",
    pl: "zapytanie",
    ru: "zapros",
    de: "angebot-anfragen",
    fr: "demande-de-devis",
  },
};

export function getLocaleParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export function getPagePath(page, locale = "lt") {
  if (page === "home") return `/${locale}`;
  const slugs = pageSlugs[page];
  const safeLocale = slugs[locale] ? locale : "lt";
  return `/${safeLocale}/${slugs[safeLocale]}`;
}

export function getLocalizedPath(pathname, locale) {
  const segments = pathname.split("/").filter(Boolean);
  const currentSlug = segments[1];

  for (const [page, slugs] of Object.entries(pageSlugs)) {
    if (Object.values(slugs).includes(currentSlug)) {
      return getPagePath(page, locale);
    }
  }

  if (supportedLocales.includes(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
