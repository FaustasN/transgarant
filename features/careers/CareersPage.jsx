import Image from "next/image";
import RevealSection from "@/components/motion/RevealSection";
import CareerApplication from "./CareerApplication";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageShell from "@/components/layout/PageShell";

export default function CareersPage({ locale, content }) {
  return (
    <PageShell locale={locale} lang={locale} avoidMobileBottomBar page="careers" content={content}>
      <main>
        <RevealSection className="px-5 pb-10 pt-12 sm:px-8 sm:pb-12 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="mx-auto max-w-[1200px]">
            <Breadcrumb data-reveal locale={locale} hero={content.hero} />

            <div className="mt-8 lg:grid lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
              <div
                data-reveal
                className="relative hidden h-[410px] overflow-hidden rounded-xl bg-[#E7E5E1] lg:block"
              >
                <Image
                  src="/career.webp"
                  alt={content.hero.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 44vw, 0px"
                  className="object-cover object-center"
                />
              </div>

              <div data-reveal>
                <h1 className="max-w-2xl text-[clamp(36px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance">
                  {content.hero.title}
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
                  {content.hero.description}
                </p>
              </div>
            </div>
          </div>
        </RevealSection>

        <CareerApplication content={content} locale={locale} />
      </main>
    </PageShell>
  );
}
