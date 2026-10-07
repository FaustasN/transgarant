import { notFound } from "next/navigation";
import QuotePage from "@/features/quote/QuotePage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

function withFallback(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) {
    return override ?? base;
  }

  return Object.fromEntries(
    Object.keys({ ...base, ...override }).map((key) => [
      key,
      withFallback(base?.[key], override[key]),
    ]),
  );
}

function getQuoteContent(locale) {
  const content = resources[locale]?.quote;

  return content ? withFallback(resources.lt.quote, content) : undefined;
}

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("quote", locale, getQuoteContent(locale));
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.quote;
  if (!content) notFound();

  return <QuotePage locale={locale} content={content} />;
}
