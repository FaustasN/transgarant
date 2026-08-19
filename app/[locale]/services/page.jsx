import Header from "../globalComponents/Header";
import Footer from "../globalComponents/Footer";
import ScrollToTop from "../globalComponents/ScrollToTop";
import ServicesExperience from "@/components/ServicesExperience";
import { resources } from "@/lib/i18n";
import {
  getServicesPath,
  openGraphLocales,
  supportedLocales,
} from "@/lib/routes.mjs";

const siteUrl = "https://www.transgarant.lt";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = (resources[locale] ?? resources.lt).services;
  const canonical = `${siteUrl}${getServicesPath(locale)}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(supportedLocales.map((language) => [language, `${siteUrl}${getServicesPath(language)}`])),
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: canonical,
      siteName: "TRANSGARANT GROUP",
      locale: openGraphLocales[locale],
      type: "website",
      images: [{ url: `${siteUrl}/heroImage.webp`, width: 1600, height: 900, alt: content.hero.title }],
    },
  };
}

export default async function ServicesPage({ params }) {
  const { locale } = await params;
  const content = (resources[locale] ?? resources.lt).services;
  const pageUrl = `${siteUrl}${getServicesPath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: content.hero.breadcrumbHome, item: `${siteUrl}/${locale}` },
          { "@type": "ListItem", position: 2, name: content.hero.breadcrumbCurrent, item: pageUrl },
        ],
      },
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

  return (
    <div lang={locale} className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />
      <ServicesExperience locale={locale} content={content} />
      <Footer locale={locale} />
      <ScrollToTop />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </div>
  );
}
