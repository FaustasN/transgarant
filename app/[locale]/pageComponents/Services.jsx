import Link from "next/link";
import { ArrowRight, Boxes, Truck, Warehouse } from "lucide-react";
import { resources } from "@/lib/i18n";
import RevealSection from "@/components/RevealSection";

const serviceIcons = [Truck, Boxes, Warehouse];

export default function Services({ locale = "lt" }) {
  const services = (resources[locale] ?? resources.lt).common.services;

  return (
    <RevealSection id="paslaugos" itemStagger={0} className="bg-[#F6F5F2] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">{services.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {services.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">{services.intro}</p>
        </div>

        <div className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {services.items.map((service, index) => {
            const Icon = serviceIcons[index];

            return (
              <article data-reveal-item key={service.title} className="group rounded-xl border border-[#DEDEE4] bg-white p-7 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:border-[#AE2422]/30 hover:shadow-[0_20px_45px_rgba(25,25,37,0.10)] sm:p-8">
                <div className="inline-flex rounded-lg bg-[#F5E5E4] p-3 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  <Icon aria-hidden="true" size={30} strokeWidth={1.7} className="text-[#AE2422]" />
                </div>
                <h3 className="mt-7 text-2xl font-bold leading-tight tracking-[-0.02em] text-[#191925]">
                  {service.title}
                </h3>
                <p className="mt-4 text-[15px] leading-7 text-[#6F7080] sm:text-base sm:leading-8">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>

        <div data-reveal className="mt-14 flex justify-center lg:mt-16">
          <Link
            href={`/${locale}/paslaugos`}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#AE2422] px-6 py-3 font-bold !text-white transition-colors hover:bg-[#92201E]"
          >
            {services.cta}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </RevealSection>
  );
}
