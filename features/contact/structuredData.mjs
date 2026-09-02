import { getContactPath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  const pageUrl = `${siteUrl}${getContactPath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("contact", locale, content.hero),
      {
        "@type": "ContactPage",
        name: content.meta.title,
        description: content.meta.description,
        url: pageUrl,
        inLanguage: locale,
        mainEntity: {
          "@type": "Organization",
          name: "UAB TRANSGARANT GROUP",
          url: siteUrl,
          email: content.details.email,
          telephone: "+37052072775",
          taxID: content.company.vat,
          address: {
            "@type": "PostalAddress",
            streetAddress: content.details.addressLine1,
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
