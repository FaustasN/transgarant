import { getCareersPath } from "../../lib/routing/paths.mjs";
import { siteUrl } from "../../lib/seo/site.mjs";
import { createBreadcrumbs } from "../../lib/seo/structuredData.mjs";

export function getStructuredData(locale, content) {
  const pageUrl = `${siteUrl}${getCareersPath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs("careers", locale, content.hero),
      ...content.positions.items.map((job) => ({
        "@type": "JobPosting",
        title: job.title,
        description: [
          ...job.responsibilities,
          ...job.requirements,
          ...job.offer,
        ].join(" "),
        hiringOrganization: {
          "@type": "Organization",
          name: "UAB TRANSGARANT GROUP",
          sameAs: siteUrl,
        },
        jobLocation: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Vilnius",
            addressCountry: "LT",
          },
        },
        url: `${pageUrl}#${job.id}`,
      })),
    ],
  };

  return structuredData;
}
