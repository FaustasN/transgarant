import Hero from "@/features/home/Hero";
import Services from "@/features/home/Services";
import Destinations from "@/features/home/Destinations";
import About from "@/features/home/About";
import FinalCta from "@/features/home/FinalCta";
import PageShell from "@/components/layout/PageShell";
import { resources } from "@/lib/i18n/resources";

export default function HomePage({ locale }) {
  const common = resources[locale].common;

  return (
    <PageShell locale={locale}>
      <main>
        <Hero locale={locale} content={common.hero} />

        <Services locale={locale} content={common.services} />

        <Destinations locale={locale} content={common.destinations} />

        <About locale={locale} content={common.about} />

        <FinalCta locale={locale} content={common.finalCta} />
      </main>
    </PageShell>
  );
}
