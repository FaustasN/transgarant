import Header from "./globalComponents/Header";
import Footer from "./globalComponents/Footer";
import Hero from "./pageComponents/Hero";
import Services from "./pageComponents/Services";
import Destinations from "./pageComponents/Destinations";
import About from "./pageComponents/About";
import FinalCta from "./pageComponents/FinalCta";
import ScrollToTop from "./globalComponents/ScrollToTop";
import { resources } from "@/lib/i18n";
import { openGraphLocales, supportedLocales } from "@/lib/routes.mjs";

const siteUrl = "https://www.transgarant.lt";

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.common;

  if (!content) return {};

  const canonical = `${siteUrl}/${locale}`;
  const title = `${content.hero.titlePrimary} ${content.hero.titleSecondary} | TRANSGARANT GROUP`;

  return {
    title,
    description: content.hero.description,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        supportedLocales.map((language) => [language, `${siteUrl}/${language}`]),
      ),
    },
    openGraph: {
      title,
      description: content.hero.description,
      url: canonical,
      siteName: "TRANSGARANT GROUP",
      locale: openGraphLocales[locale],
      type: "website",
      images: [
        {
          url: `${siteUrl}/heroImage.webp`,
          alt: content.hero.imageAlt,
        },
      ],
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#F6F5F2] text-[#191925]">
      <Header locale={locale} />

      <main>
        <Hero locale={locale} />

        <Services locale={locale} />

        <Destinations locale={locale} />

        <About locale={locale} />

        <FinalCta locale={locale} />
      </main>

      <Footer locale={locale} />
      <ScrollToTop />
    </div>
  );
}
