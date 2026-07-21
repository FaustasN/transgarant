import Link from "next/link";
import { ArrowRight, Boxes, Truck, Warehouse } from "lucide-react";
import { resources } from "@/lib/i18n";

const serviceIcons = [Truck, Boxes, Warehouse];

export default function Services({ locale = "lt" }) {
  const services = (resources[locale] ?? resources.lt).common.services;

  return (
    <section id="paslaugos" className="bg-[#F6F5F2] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">{services.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {services.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">{services.intro}</p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {services.items.map((service, index) => {
            const Icon = serviceIcons[index];

            return (
              <article key={service.title} className="rounded-xl border border-[#DEDEE4] bg-white p-7 sm:p-8">
                <Icon aria-hidden="true" size={30} strokeWidth={1.7} className="text-[#AE2422]" />
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

        <div className="mt-10 flex justify-center">
          <Link
            href={`/${locale}/paslaugos`}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#AE2422] px-6 py-3 font-bold !text-white transition-colors hover:bg-[#92201E]"
          >
            {services.cta}
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
