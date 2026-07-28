import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Header from "../globalComponents/Header";
import Footer from "../globalComponents/Footer";
import ScrollToTop from "../globalComponents/ScrollToTop";
import RevealSection from "@/components/RevealSection";
import { resources } from "@/lib/i18n";
import { getCareersPath } from "@/lib/routes.mjs";
import CareerApplication from "./CareerApplication";

const siteUrl = "https://www.transgarant.lt";
const availableLocales = ["lt", "en", "pl", "ru"];
const openGraphLocales = {
  lt: "lt_LT",
  en: "en_US",
  pl: "pl_PL",
  ru: "ru_RU",
};

export const dynamicParams = false;

export function generateStaticParams() {
  return availableLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.careers;

  if (!content) return {};

  const canonical = `${siteUrl}${getCareersPath(locale)}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        availableLocales.map((language) => [
          language,
          `${siteUrl}${getCareersPath(language)}`,
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
      images: [
        {
          url: `${siteUrl}/career.webp`,
          width: 1165,
          height: 594,
          alt: content.hero.imageAlt,
        },
      ],
    },
  };
}

export default async function CareersPage({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.careers;

  if (!content) notFound();

  const pageUrl = `${siteUrl}${getCareersPath(locale)}`;
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

  return (
    <div lang={locale} className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />
      <main>
        <RevealSection className="px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-16">
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

            <div className="mt-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
              <div
                data-reveal
                className="relative hidden h-[410px] overflow-hidden rounded-xl bg-[#E7E5E1] lg:block"
              >
                <Image
                  src="/career.webp"
                  alt={content.hero.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 0px"
                  className="object-cover object-center"
                />
              </div>

              <div data-reveal>
                <h1 className="max-w-3xl text-[clamp(42px,6vw,72px)] font-extrabold leading-[0.98] tracking-[-0.05em] text-balance">
                  {content.hero.title}
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
                  {content.hero.description}
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        <CareerApplication content={content} />
      </main>
      <Footer locale={locale} />
      <ScrollToTop avoidMobileBottomBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
