import { getPagePath } from "../routing/paths.mjs";
import { openGraphLocales, supportedLocales } from "../routing/locales.mjs";
import { siteName, siteUrl } from "./site.mjs";

const pageImages = {
  home: { path: "/heroImage.webp" },
  about: { path: "/4.webp", width: 1600, height: 900 },
  careers: { path: "/career.webp", width: 1165, height: 594 },
  services: { path: "/heroImage.webp", width: 1600, height: 900 },
};

export function createPageMetadata(page, locale, content) {
  if (!content) return {};

  const title = page === "home"
    ? `${content.hero.titlePrimary} ${content.hero.titleSecondary} | ${siteName}`
    : content.meta.title;
  const description = page === "home" ? content.hero.description : content.meta.description;
  const canonical = `${siteUrl}${getPagePath(page, locale)}`;
  const image = pageImages[page];

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        supportedLocales.map((language) => [language, `${siteUrl}${getPagePath(page, language)}`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: openGraphLocales[locale],
      type: "website",
      ...(image && {
        images: [{
          url: `${siteUrl}${image.path}`,
          ...(image.width && { width: image.width, height: image.height }),
          alt: page === "services" ? content.hero.title : content.hero.imageAlt,
        }],
      }),
    },
  };
}
