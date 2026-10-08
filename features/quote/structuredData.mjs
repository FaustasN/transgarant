import { getQuotePath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  const pageUrl = `${siteUrl}${getQuotePath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("quote", locale, content.hero),
      {
        "@type": "WebPage",
        name: content.meta.title,
        description: content.meta.description,
        url: pageUrl,
        inLanguage: locale,
        about: {
          "@type": "Service",
          name: content.hero.title,
          provider: {
            "@type": "Organization",
            name: "UAB TRANSGARANT GROUP",
            url: siteUrl,
            email: "info@transgarant.lt",
          },
        },
      },
    ],
  };

  return structuredData;
}
