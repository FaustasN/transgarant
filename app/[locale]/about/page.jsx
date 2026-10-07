import AboutPage from "@/features/about/AboutPage";
import { resources } from "@/lib/i18n/resources";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("about", locale, resources[locale].about);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <AboutPage locale={locale} content={resources[locale].about} />;
}
