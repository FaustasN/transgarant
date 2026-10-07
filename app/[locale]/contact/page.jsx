import { notFound } from "next/navigation";
import ContactPage from "@/features/contact/ContactPage";
import { resources } from "@/lib/i18n/resources";
import { getLocaleParams } from "@/lib/routing/paths.mjs";
import { createPageMetadata } from "@/lib/seo/metadata.mjs";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLocaleParams();
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return createPageMetadata("contact", locale, resources[locale]?.contact);
}

export default async function Page({ params }) {
  const { locale } = await params;
  const content = resources[locale]?.contact;
  if (!content) notFound();

  return <ContactPage locale={locale} content={content} />;
}
