import { notFound } from "next/navigation";
import AboutPage from "@/features/about/AboutPage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("about", locale, resources[locale]?.about);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.about;
  if (!content) notFound();

  return <AboutPage locale={locale} content={content} />;
}
