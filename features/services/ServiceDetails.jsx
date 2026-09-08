import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getQuotePath } from "@/lib/routing/paths.mjs";

export default function ServiceDetails({ service, content, visual, locale, mobile = false }) {
  return (
    <>
      <header>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#AE2422]">
          {service.kicker}
        </p>
        <h3
          className={`mt-3 font-extrabold leading-[1.04] tracking-[-0.035em] text-[#191925] ${
            mobile ? "text-[30px]" : "text-[clamp(34px,4vw,50px)]"
          }`}
        >
          {service.heading}
        </h3>
        <p
          className={`mt-5 font-semibold text-[#313152] ${
            mobile ? "text-lg leading-7" : "max-w-3xl text-xl leading-8"
          }`}
        >
          {service.intro}
        </p>
      </header>

      <div
        className={`relative mt-7 overflow-hidden bg-[#E7E5E1] ${
          mobile ? "aspect-[16/10]" : "aspect-[16/7] min-h-[280px]"
        }`}
      >
        <Image
          src={visual.image}
          alt={service.imageAlt}
          fill
          sizes={mobile ? "100vw" : "(min-width: 1024px) 760px, 100vw"}
          className="object-cover"
        />
      </div>

      <div
        className={`grid text-[#6F7080] ${
          mobile
            ? "mt-7 gap-5 text-[15px] leading-7"
            : "mt-9 gap-7 text-base leading-8 xl:grid-cols-2 xl:gap-10"
        }`}
      >
        {service.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      <div className={`${mobile ? "mt-8 py-6" : "mt-10 py-8"} border-y border-[#D9D8DE]`}>
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#AE2422]">
          {content.explorer.suitableLabel}
        </p>
        <ul className={`mt-5 grid gap-x-8 gap-y-3 ${mobile ? "" : "sm:grid-cols-2"}`}>
          {service.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-sm font-semibold leading-6 text-[#313152] sm:text-[15px]"
            >
              <Check aria-hidden="true" size={17} strokeWidth={2.4} className="mt-1 shrink-0 text-[#AE2422]" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Link
        data-analytics-event="cta_click"
        data-analytics-cta-id={`service_quote_${service.key}`}
        data-analytics-placement={mobile ? "services_mobile_panel" : "services_desktop_panel"}
        data-analytics-destination={getQuotePath(locale)}
        href={getQuotePath(locale)}
        className={`items-center gap-3 font-bold text-[#313152] transition-colors hover:text-[#AE2422] ${
          mobile
            ? "mt-3 flex min-h-10 w-full justify-center text-center"
            : "group relative mt-6 inline-flex min-h-12 pb-1 after:absolute after:bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[#AE2422] after:transition-transform after:duration-300 hover:after:scale-x-100"
        }`}
      >
        {content.explorer.cta}
        <ArrowRight
          aria-hidden="true"
          size={18}
          className={`text-[#AE2422] ${mobile ? "" : "transition-transform duration-300 group-hover:translate-x-1.5"}`}
        />
      </Link>
    </>
  );
}
