import QuotePage from "@/features/quote/QuotePage";
import { resources } from "@/lib/i18n/resources";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("quote", locale, resources[locale].quote);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <QuotePage locale={locale} content={resources[locale].quote} />;
}
