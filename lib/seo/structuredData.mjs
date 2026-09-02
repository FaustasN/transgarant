import { getPagePath } from "../routing/paths.mjs";
import { siteUrl } from "./site.mjs";

export function createBreadcrumbs(page, locale, hero) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: hero.breadcrumbHome, item: `${siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: hero.breadcrumbCurrent, item: `${siteUrl}${getPagePath(page, locale)}` },
    ],
  };
}

export function serializeStructuredData(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
