import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import AboutExperienceSection from "@/features/about/AboutExperienceSection";
import RevealSection from "@/components/motion/RevealSection";
import { getQuotePath } from "@/lib/routing/paths.mjs";
import PageShell from "@/components/layout/PageShell";
import StructuredData from "@/lib/seo/StructuredData.jsx";
import { getStructuredData } from "./structuredData.mjs";

export default function AboutPage({ locale, content }) {
  const structuredData = getStructuredData(locale, content);

  return (
    <PageShell locale={locale} lang={locale} structuredData={<StructuredData data={structuredData} />}>
      <main>
        <RevealSection className="px-5 pb-10 pt-12 sm:px-8 sm:pt-14 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="mx-auto max-w-[1200px]">
            <nav
              data-reveal
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-[#6F7080]"
            >
              <Link href={`/${locale}`} className="transition-colors hover:text-[#AE2422]">
                {content.hero.breadcrumbHome}
              </Link>
              <ChevronRight aria-hidden="true" size={14} />
              <span aria-current="page" className="font-semibold text-[#313152]">
                {content.hero.breadcrumbCurrent}
              </span>
            </nav>

            <div className="mt-4 grid items-stretch gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div data-reveal>
                <h1 className="max-w-2xl text-[clamp(36px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance">
                  {content.hero.title}
                </h1>
                <p className="mt-7 max-w-xl text-base leading-8 text-[#6F7080] sm:text-lg">
                  {content.hero.intro}
                </p>
              </div>

              <div
                data-reveal-item
                className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#E7E5E1] lg:aspect-auto lg:h-full"
              >
                <Image
                  src="/4.webp"
                  alt={content.hero.imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </RevealSection>

        <AboutExperienceSection content={content.overview} />

        <RevealSection className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
          <div className="mx-auto grid max-w-[1200px] items-start gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:grid-rows-[1fr_auto] lg:gap-x-24 lg:gap-y-12 xl:gap-x-32">
            <div data-reveal className="lg:col-start-1 lg:row-start-1">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9C7636]">
                {content.trust.eyebrow}
              </p>
              <h2 className="mt-5 text-[clamp(38px,4.5vw,56px)] font-extrabold leading-[1] tracking-[-0.04em] text-balance">
                {content.trust.title}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#6F7080] sm:text-lg">
                {content.trust.description}
              </p>
            </div>

            <a
              data-reveal-item
              href="/certificates/patikimas-darbdavys-2026.jpg"
              target="_blank"
              rel="noreferrer"
              aria-label={content.trust.imageAlt}
              className="group mx-auto block w-full max-w-[360px] lg:col-start-2 lg:row-span-2 lg:row-start-1"
            >
              <Image
                src="/certificates/patikimas-darbdavys-2026.jpg"
                alt={content.trust.imageAlt}
                width={654}
                height={960}
                sizes="(min-width: 1024px) 360px, 80vw"
                className="h-auto w-full rounded-xl shadow-[0_20px_55px_rgba(25,25,37,0.16)] transition-transform duration-300 group-hover:-translate-y-1"
              />
            </a>

            <Link
              data-analytics-event="cta_click"
              data-analytics-cta-id="about_quote"
              data-analytics-placement="about_page"
              data-analytics-destination={getQuotePath(locale)}
              href={getQuotePath(locale)}
              className="group flex max-w-xl items-center gap-5 border-y border-[#D9D8DE] py-6 lg:col-start-1 lg:row-start-2 lg:self-end"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold leading-7 text-[#313152] sm:text-2xl">
                  {content.cta.title}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#6F7080] sm:text-base">
                  {content.cta.description}
                </span>
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center text-[#191925]">
                <ArrowRight
                  aria-hidden="true"
                  size={20}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </span>
            </Link>
          </div>
        </RevealSection>

      </main>
    </PageShell>
  );
}
