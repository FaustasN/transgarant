import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPagePath } from "@/lib/routing/paths.mjs";
import RevealSection from "@/components/motion/RevealSection";

export default function FinalCta({ locale, content: cta }) {

  return (
    <RevealSection className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
      <div data-reveal className="relative mx-auto max-w-[1100px] overflow-hidden rounded-xl bg-[#313152] px-6 py-14 text-white shadow-[0_24px_60px_rgba(49,49,82,0.18)] sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute -right-20 -top-28 h-64 w-64 rounded-full border-[45px] border-white/[0.04]" />
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-[clamp(36px,4vw,52px)] font-bold leading-[1.04] tracking-[-0.02em]">
              {cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/74 sm:text-lg">{cta.description}</p>
          </div>

          <Link
            data-analytics-event="cta_click"
            data-analytics-cta-id="final_quote"
            data-analytics-placement="home_final_cta"
            data-analytics-destination={getPagePath("quote", locale)}
            href={getPagePath("quote", locale)}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#F6F5F2] px-6 py-3 font-bold !text-[#191925] transition-colors hover:bg-white sm:w-auto"
          >
            {cta.button}
            <ArrowRight
              aria-hidden="true"
              size={18}
              className="text-[#AE2422] transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>
      </div>
    </RevealSection>
  );
}
