import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Header from "../globalComponents/Header";
import Footer from "../globalComponents/Footer";
import ScrollToTop from "../globalComponents/ScrollToTop";
import RevealSection from "@/components/RevealSection";
import { resources } from "@/lib/i18n";
import { getContactPath } from "@/lib/routes.mjs";
import ContactForm from "./ContactForm";

const siteUrl = "https://www.transgarant.lt";
const availableLocales = ["lt", "en", "pl", "ru"];
const openGraphLocales = {
  lt: "lt_LT",
  en: "en_US",
  pl: "pl_PL",
  ru: "ru_RU",
};
const mapUrl =
  "https://www.google.com/maps?q=Laisv%C4%97s%20pr.%2078B-238%2C%20Vilnius%2C%20LT-05263&output=embed";
const mapLink =
  "https://www.google.com/maps/search/?api=1&query=Laisv%C4%97s%20pr.%2078B-238%2C%20Vilnius%2C%20LT-05263";

export const dynamicParams = false;

export function generateStaticParams() {
  return availableLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.contact;

  if (!content) return {};

  const canonical = `${siteUrl}${getContactPath(locale)}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        availableLocales.map((language) => [
          language,
          `${siteUrl}${getContactPath(language)}`,
        ]),
      ),
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      url: canonical,
      siteName: "TRANSGARANT GROUP",
      locale: openGraphLocales[locale],
      type: "website",
    },
  };
}

function ContactValue({ label, children, className = "" }) {
  return (
    <div className={`py-7 sm:py-8 ${className}`}>
      <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#AE2422]">
        {label}
      </p>
      <div className="mt-4 text-lg font-bold leading-8 text-[#313152] sm:text-xl">
        {children}
      </div>
    </div>
  );
}

export default async function ContactPage({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.contact;

  if (!content) notFound();

  const pageUrl = `${siteUrl}${getContactPath(locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: content.hero.breadcrumbHome,
            item: `${siteUrl}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.hero.breadcrumbCurrent,
            item: pageUrl,
          },
        ],
      },
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

  return (
    <div lang={locale} className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />
      <main>
        <RevealSection className="px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
          <div className="mx-auto max-w-[1200px]">
            <nav
              data-reveal
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-[#6F7080]"
            >
              <Link href={`/${locale}`} className="transition-colors hover:text-[#AE2422]">
                {content.hero.breadcrumbHome}
              </Link>
              <ChevronRight aria-hidden="true" size={14} />
              <span aria-current="page" className="font-semibold text-[#313152]">
                {content.hero.breadcrumbCurrent}
              </span>
            </nav>

            <div data-reveal className="mt-5 max-w-3xl">
              <h1 className="text-[clamp(42px,6vw,72px)] font-extrabold leading-[0.98] tracking-[-0.05em]">
                {content.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
                {content.hero.description}
              </p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-24">
          <div className="mx-auto max-w-[1200px]">
            <div
              data-reveal
              className="aspect-[4/3] overflow-hidden rounded-xl bg-[#E7E5E1] sm:aspect-[16/8] lg:aspect-[16/6]"
            >
              <iframe
                src={mapUrl}
                title={content.details.mapTitle}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>

            <div
              data-reveal
              className="mt-10 grid border-y border-[#D9D8DE] md:grid-cols-2 lg:mt-12"
            >
              <ContactValue
                label={content.details.emailLabel}
                className="border-b border-[#D9D8DE] md:border-r md:px-8 lg:px-10"
              >
                <a
                  href={`mailto:${content.details.email}`}
                  className="transition-colors hover:text-[#AE2422]"
                >
                  {content.details.email}
                </a>
              </ContactValue>

              <ContactValue
                label={content.details.phonesLabel}
                className="border-b border-[#D9D8DE] md:px-8 lg:px-10"
              >
                <div className="grid">
                  <a href="tel:+37052072775" className="transition-colors hover:text-[#AE2422]">
                    {content.details.officePhone}
                  </a>
                  <a href="tel:+37068818888" className="transition-colors hover:text-[#AE2422]">
                    {content.details.mobilePhone}
                  </a>
                </div>
              </ContactValue>

              <ContactValue
                label={content.details.addressLabel}
                className="border-b border-[#D9D8DE] md:border-b-0 md:border-r md:px-8 lg:px-10"
              >
                <address className="not-italic">
                  <span className="block">{content.details.addressLine1}</span>
                  <span className="block">{content.details.addressLine2}</span>
                </address>
              </ContactValue>

              <ContactValue
                label={content.details.hoursLabel}
                className="md:px-8 lg:px-10"
              >
                <p>{content.details.hours}</p>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-3 inline-flex items-center gap-2 text-sm text-[#6F7080] transition-colors hover:text-[#AE2422]"
                >
                  {content.details.mapLink}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </a>
              </ContactValue>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-t border-[#D9D8DE] bg-[#EDECF0] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <div data-reveal>
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
                {content.form.eyebrow}
              </p>
              <h2 className="mt-5 max-w-md text-[clamp(34px,4.2vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em]">
                {content.form.title}
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-[#6F7080]">
                {content.form.description}
              </p>
            </div>
            <div data-reveal>
              <ContactForm content={content.form} />
            </div>
          </div>
        </RevealSection>

        <RevealSection className="bg-white px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div data-reveal className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
                  {content.company.eyebrow}
                </p>
                <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[#313152] sm:text-3xl">
                  {content.company.title}
                </h2>
              </div>
              <dl className="border-t border-[#D9D8DE]">
                {[
                  [content.company.companyCodeLabel, content.company.companyCode],
                  [content.company.vatLabel, content.company.vat],
                  [content.company.bankLabel, content.company.bank],
                  [content.company.ibanLabel, content.company.iban],
                  [content.company.swiftLabel, content.company.swift],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="grid gap-1 border-b border-[#D9D8DE] py-4 sm:grid-cols-[180px_1fr] sm:gap-6"
                  >
                    <dt className="text-sm font-semibold text-[#6F7080]">{label}</dt>
                    <dd className="break-words font-bold text-[#313152]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </RevealSection>
      </main>
      <Footer locale={locale} />
      <ScrollToTop />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
