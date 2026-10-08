import CareersPage from "@/features/careers/CareersPage";
import { resources } from "@/lib/i18n/resources";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("careers", locale, resources[locale].careers);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <CareersPage locale={locale} content={resources[locale].careers} />;
}
