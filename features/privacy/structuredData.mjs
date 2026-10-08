import { getPrivacyPath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("privacy", locale, content.hero),
      {
        "@type": "WebPage",
        name: content.meta.title,
        description: content.meta.description,
        url: `${siteUrl}${getPrivacyPath(locale)}`,
        inLanguage: locale,
      },
    ],
  };
}
