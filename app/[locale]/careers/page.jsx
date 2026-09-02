import { notFound } from "next/navigation";
import CareersPage from "@/features/careers/CareersPage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/locales.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("careers", locale, resources[locale]?.careers);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.careers;
  if (!content) notFound();

  return <CareersPage locale={locale} content={content} />;
}
