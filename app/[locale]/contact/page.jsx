import ContactPage from "@/features/contact/ContactPage";
import { resources } from "@/lib/i18n/resources";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("contact", locale, resources[locale].contact);
}

export default async function Page({ params }) {
  const { locale } = await params;

  return <ContactPage locale={locale} content={resources[locale].contact} />;
}
