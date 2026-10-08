import { notFound } from "next/navigation";
import PrivacyPage from "@/features/privacy/PrivacyPage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/locales.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("privacy", locale, resources[locale]?.privacy);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.privacy;
  if (!content) notFound();

  return <PrivacyPage locale={locale} content={content} />;
}
