import ServicesExperience from "@/features/services/ServicesExperience";
import PageShell from "@/components/layout/PageShell";
import StructuredData from "@/lib/seo/StructuredData.jsx";
import { getStructuredData } from "./structuredData.mjs";

export default function ServicesPage({ locale, content }) {
  const structuredData = getStructuredData(locale, content);

  return (
    <PageShell locale={locale} lang={locale} structuredData={<StructuredData data={structuredData} />}>
      <ServicesExperience locale={locale} content={content} />
    </PageShell>
  );
}
