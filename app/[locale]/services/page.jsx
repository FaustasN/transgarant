import ServicesPage from "@/features/services/ServicesPage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("services", locale, (resources[locale] ?? resources.lt).services);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = (resources[locale] ?? resources.lt).services;

  return <ServicesPage locale={locale} content={content} />;
}
