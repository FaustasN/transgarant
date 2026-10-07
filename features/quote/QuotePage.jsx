import Link from "next/link";
import { ChevronRight } from "lucide-react";
import RevealSection from "@/components/motion/RevealSection";
import QuoteForm from "./QuoteForm";
import PageShell from "@/components/layout/PageShell";
import StructuredData from "@/lib/seo/StructuredData.jsx";
import { getStructuredData } from "./structuredData.mjs";

export default function QuotePage({ locale, content }) {
  const structuredData = getStructuredData(locale, content);

  return (
    <PageShell locale={locale} lang={locale} structuredData={<StructuredData data={structuredData} />}>
      <main>
        <RevealSection className="px-5 pb-12 pt-12 sm:px-8 sm:pb-14 sm:pt-14 lg:px-10 lg:pb-16 lg:pt-16">
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
