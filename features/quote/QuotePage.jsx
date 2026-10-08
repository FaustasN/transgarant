import RevealSection from "@/components/motion/RevealSection";
import QuoteForm from "./QuoteForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageShell from "@/components/layout/PageShell";

export default function QuotePage({ locale, content }) {
  return (
    <PageShell avoidMobileBottomBar locale={locale} lang={locale} page="quote" content={content}>
      <main>
        <RevealSection className="px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
          <div className="mx-auto max-w-[1200px]">
            <Breadcrumb data-reveal locale={locale} hero={content.hero} />

            <div data-reveal className="mt-5 max-w-4xl">
              <h1 className="max-w-2xl text-[clamp(36px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance">
                {content.hero.title}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
                {content.hero.description}
              </p>
            </div>
          </div>
        </RevealSection>

        <RevealSection className="border-t border-[#D9D8DE] bg-[#EDECF0] px-5 pb-4 sm:px-8 lg:px-10">
          <div data-reveal className="mx-auto max-w-[1200px]">
            <QuoteForm content={content.form} locale={locale} />
          </div>
        </RevealSection>
      </main>
    </PageShell>
  );
}
