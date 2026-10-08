import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RevealSection from "@/components/motion/RevealSection";
import PageShell from "@/components/layout/PageShell";
import { AnalyticsPreferencesButton } from "@/components/analytics/Analytics";
import { normalizeMeasurementId } from "@/lib/analytics/core.mjs";
import StructuredData from "@/lib/seo/StructuredData.jsx";
import { getStructuredData } from "./structuredData.mjs";

export default function PrivacyPage({ locale, content }) {
  const structuredData = getStructuredData(locale, content);
  const analyticsEnabled = Boolean(normalizeMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID));

  return (
    <PageShell locale={locale} lang={locale} structuredData={<StructuredData data={structuredData} />}>
      <main>
        <RevealSection className="px-5 pb-20 pt-12 sm:px-8 sm:pt-14 lg:px-10 lg:pb-28 lg:pt-16">
          <div className="mx-auto max-w-[900px]">
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

            <div data-reveal className="mt-4">
              <h1 className="text-[clamp(36px,4.2vw,56px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance">
                {content.hero.title}
              </h1>
              <p className="mt-7 text-base leading-8 text-[#6F7080] sm:text-lg">
                {content.hero.intro}
              </p>
              <p className="mt-4 text-sm font-semibold text-[#6F7080]">{content.updated}</p>
            </div>

            <div className="mt-12 divide-y divide-[#D9D8DE] border-y border-[#D9D8DE]">
              {content.sections.map((section, index) => (
                <section key={section.title} data-reveal-item className="py-8 sm:py-10">
                  <h2 className="text-xl font-extrabold leading-7 tracking-[-0.02em] text-[#313152] sm:text-2xl">
                    <span className="mr-3 text-[#AE2422]">{index + 1}.</span>
                    {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-base leading-8 text-[#4A4B5C]">
                      {paragraph}
                    </p>
                  ))}
                  {section.items && (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-8 text-[#4A4B5C] marker:text-[#AE2422]">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.id === "cookies" && (
                    <AnalyticsPreferencesButton
                      enabled={analyticsEnabled}
                      label={content.cookieSettings}
                      className="mt-6 rounded-lg border border-[#313152] px-5 py-3 text-sm font-bold text-[#313152] transition-colors hover:bg-[#313152] hover:text-white"
                    />
                  )}
                </section>
              ))}
            </div>
          </div>
        </RevealSection>
      </main>
    </PageShell>
  );
}
