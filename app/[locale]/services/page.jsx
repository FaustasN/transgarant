import ServicesPage from "@/features/services/ServicesPage";
import { resources } from "@/lib/i18n/resources";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("services", locale, resources[locale].services);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <ServicesPage locale={locale} content={resources[locale].services} />;
}
