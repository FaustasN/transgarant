"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Boxes, ChevronDown, Truck, Warehouse } from "lucide-react";
import { gsap, useGsapScope } from "@/lib/motion";
import { getPagePath } from "@/lib/routing/paths.mjs";
import RevealSection from "@/components/motion/RevealSection";

const serviceIcons = [Truck, Boxes, Warehouse];

export default function Services({ locale, content: services }) {
  const [openService, setOpenService] = useState(null);
  const cardsRef = useRef(null);

  useGsapScope(cardsRef, (cardsElement) => {
    const cards = gsap.utils.toArray("[data-service-card]");
    if (!cards.length) return;

    gsap.from(cards, {
      y: 14,
      autoAlpha: 0,
      duration: 0.45,
      stagger: 0.07,
      ease: "power3.out",
      scrollTrigger: {
        trigger: cardsElement,
        start: "top 86%",
        once: true,
      },
    });
  });

  return (
    <RevealSection id="paslaugos" className="bg-[#F6F5F2] px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">{services.eyebrow}</p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {services.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">{services.intro}</p>
        </div>

        <div ref={cardsRef} className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {services.items.map((service, index) => {
            const Icon = serviceIcons[index];

            return (
              <article
                data-service-card
                key={service.title}
                className="group overflow-hidden rounded-xl border border-[#DEDEE4] bg-white transition-[transform,box-shadow,border-color] duration-300 lg:p-8 lg:hover:-translate-y-2 lg:hover:border-[#AE2422]/30 lg:hover:shadow-[0_20px_45px_rgba(25,25,37,0.10)]"
              >
                <button
                  type="button"
                  aria-expanded={openService === index}
                  aria-controls={`service-description-${index}`}
                  onClick={() => setOpenService((current) => current === index ? null : index)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left lg:block lg:cursor-default lg:p-0"
                >
                  <span className="inline-flex shrink-0 rounded-lg bg-[#F5E5E4] p-2.5 transition-transform duration-300 group-hover:scale-105 lg:p-3 lg:group-hover:scale-110 lg:group-hover:-rotate-3">
                    <Icon aria-hidden="true" size={24} strokeWidth={1.7} className="text-[#AE2422] lg:h-[30px] lg:w-[30px]" />
                  </span>
                  <h3 className="min-w-0 flex-1 text-lg font-bold leading-tight tracking-[-0.02em] text-[#191925] lg:mt-7 lg:text-2xl">
                    {service.title}
                  </h3>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className={`shrink-0 text-[#AE2422] transition-transform duration-200 lg:hidden ${
                      openService === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`service-description-${index}`}
                  className={`grid transition-[grid-template-rows] duration-[250ms] ease-out lg:grid-rows-[1fr] ${
                    openService === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-[15px] leading-7 text-[#6F7080] lg:mt-4 lg:px-0 lg:pb-0 lg:text-base lg:leading-8">
                      {service.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div data-reveal className="mt-14 flex justify-center lg:mt-16">
          <Link
            data-analytics-event="cta_click"
            data-analytics-cta-id="services_overview"
            data-analytics-placement="home_services"
            data-analytics-destination={getPagePath("services", locale)}
            href={getPagePath("services", locale)}
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
