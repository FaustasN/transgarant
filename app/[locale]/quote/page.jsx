import { notFound } from "next/navigation";
import QuotePage from "@/features/quote/QuotePage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/locales.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("quote", locale, resources[locale]?.quote);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.quote;
  if (!content) notFound();

  return <QuotePage locale={locale} content={content} />;
}
