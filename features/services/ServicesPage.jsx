import ServicesExperience from "@/features/services/ServicesExperience";
import PageShell from "@/components/layout/PageShell";

export default function ServicesPage({ locale, content }) {
  return (
    <PageShell locale={locale} lang={locale} page="services" content={content}>
      <ServicesExperience locale={locale} content={content} />
    </PageShell>
  );
}
