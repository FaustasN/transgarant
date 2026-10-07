import { getPagePath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  const pageUrl = `${siteUrl}${getPagePath("services", locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("services", locale, content.hero),
      {
        "@type": "Service",
        name: content.hero.title,
        description: content.meta.description,
        url: pageUrl,
        provider: {
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
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: content.explorer.navigationLabel,
          itemListElement: content.services.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title, description: service.intro },
          })),
        },
      },
    ],
  };

  return structuredData;
}
