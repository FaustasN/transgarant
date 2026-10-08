import { getAboutPath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  const pageUrl = `${siteUrl}${getAboutPath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("about", locale, content.hero),
      {
        "@type": "AboutPage",
        name: content.meta.title,
        description: content.meta.description,
        url: pageUrl,
        inLanguage: locale,
        mainEntity: {
          "@type": "Organization",
          name: "UAB TRANSGARANT GROUP",
          url: siteUrl,
          email: "info@transgarant.lt",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Laisvės pr. 78B-238",
            addressLocality: "Vilnius",
            postalCode: "LT-05263",
            addressCountry: "LT",
          },
        },
      },
    ],
  };

  return structuredData;
}
