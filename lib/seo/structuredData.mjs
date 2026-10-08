import { getPagePath } from "../routing/paths.mjs";
import { siteUrl } from "./site.mjs";

const companyName = "UAB TRANSGARANT GROUP";
const companyEmail = "info@transgarant.lt";
const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: "Laisvės pr. 78B-238",
  addressLocality: "Vilnius",
  postalCode: "LT-05263",
  addressCountry: "LT",
};
const organization = {
  "@type": "Organization",
  name: companyName,
  url: siteUrl,
  email: companyEmail,
  address: postalAddress,
};

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

// Page-specific nodes that follow the breadcrumbs in the JSON-LD graph.
const pageNodes = {
  about: ({ locale, content, url }) => [{
    "@type": "AboutPage",
    name: content.meta.title,
    description: content.meta.description,
    url,
    inLanguage: locale,
    mainEntity: organization,
  }],
  careers: ({ content, url }) => content.positions.items.map((job) => ({
    "@type": "JobPosting",
    title: job.title,
    description: [...job.responsibilities, ...job.requirements, ...job.offer].join(" "),
    hiringOrganization: {
      "@type": "Organization",
      name: companyName,
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
    url: `${url}#${job.id}`,
  })),
  contact: ({ locale, content, url }) => [{
    "@type": "ContactPage",
    name: content.meta.title,
    description: content.meta.description,
    url,
    inLanguage: locale,
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      url: siteUrl,
      email: content.details.email,
      telephone: "+37052072775",
      taxID: content.company.vat,
      address: { ...postalAddress, streetAddress: content.details.addressLine1 },
    },
  }],
  privacy: ({ locale, content, url }) => [{
    "@type": "WebPage",
    name: content.meta.title,
    description: content.meta.description,
    url,
    inLanguage: locale,
  }],
  quote: ({ locale, content, url }) => [{
    "@type": "WebPage",
    name: content.meta.title,
    description: content.meta.description,
    url,
    inLanguage: locale,
    about: {
      "@type": "Service",
      name: content.hero.title,
      provider: {
        "@type": "Organization",
        name: companyName,
        url: siteUrl,
        email: companyEmail,
      },
    },
  }],
  services: ({ content, url }) => [{
    "@type": "Service",
    name: content.hero.title,
    description: content.meta.description,
    url,
    provider: organization,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: content.explorer.navigationLabel,
      itemListElement: content.services.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: service.title, description: service.intro },
      })),
    },
  }],
};

export function getStructuredData(page, locale, content) {
  const url = `${siteUrl}${getPagePath(page, locale)}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      createBreadcrumbs(page, locale, content.hero),
      ...pageNodes[page]({ locale, content, url }),
    ],
  };
}
