import Hero from "@/features/home/Hero";
import Services from "@/features/home/Services";
import Destinations from "@/features/home/Destinations";
import About from "@/features/home/About";
import FinalCta from "@/features/home/FinalCta";
import PageShell from "@/components/layout/PageShell";

export default function HomePage({ locale }) {
  return (
    <PageShell locale={locale}>

      <main>
        <Hero locale={locale} />

        <Services locale={locale} />

        <Destinations locale={locale} />

        <About locale={locale} />

        <FinalCta locale={locale} />
      </main>

    </PageShell>
  );
}
