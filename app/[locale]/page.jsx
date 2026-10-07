import HomePage from "@/features/home/HomePage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("home", locale, resources[locale]?.common);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <HomePage locale={locale} />;
}
