import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Header from "../globalComponents/Header";
import Footer from "../globalComponents/Footer";
import ScrollToTop from "../globalComponents/ScrollToTop";
import RevealSection from "@/components/RevealSection";
import { resources } from "@/lib/i18n";
import {
  getQuotePath,
  openGraphLocales,
  supportedLocales,
} from "@/lib/routes.mjs";
import QuoteForm from "./QuoteForm";

const siteUrl = "https://www.transgarant.lt";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.quote;

  if (!content) return {};

  const canonical = `${siteUrl}${getQuotePath(locale)}`;

  return {
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        supportedLocales.map((language) => [
          language,
          `${siteUrl}${getQuotePath(language)}`,
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

export default async function QuotePage({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.quote;

  if (!content) notFound();

  const pageUrl = `${siteUrl}${getQuotePath(locale)}`;
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

            <div data-reveal className="mt-5 max-w-4xl">
              <h1 className="max-w-2xl text-[clamp(36px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance">
                {content.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
                {content.hero.description}
              </p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-t border-[#D9D8DE] bg-[#EDECF0] px-5 pb-4 sm:px-8 lg:px-10">
          <div data-reveal className="mx-auto max-w-[1200px]">
            <QuoteForm content={content.form} locale={locale} />
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
