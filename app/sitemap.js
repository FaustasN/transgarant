import { getPagePath, pageSlugs, supportedLocales } from "../lib/routing/paths.mjs";
import { siteUrl } from "../lib/seo/site.mjs";

export default function sitemap() {
  return ["home", ...Object.keys(pageSlugs)].flatMap((page) => {
    const languages = Object.fromEntries(
      supportedLocales.map((locale) => [locale, `${siteUrl}${getPagePath(page, locale)}`]),
    );

    return supportedLocales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}
