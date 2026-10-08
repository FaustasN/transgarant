"use client";

import { useState } from "react";
import { ChevronRight, Container } from "lucide-react";
import ServiceDetails from "./ServiceDetails";
import { serviceVisuals } from "./serviceVisuals";

// Mobile layout of the services page: one expandable panel per service.
export default function ServicesAccordion({ locale, content }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="mt-12 border-t border-[#D9D8DE] lg:hidden">
      {content.services.map((service, index) => {
        const Icon = serviceVisuals[service.key]?.icon ?? Container;
        const visual = serviceVisuals[service.key] ?? serviceVisuals.road;
        const active = activeIndex === index;
        return (
          <div key={service.key} className="border-b border-[#D9D8DE]">
            <button
              id={`mobile-service-control-${service.key}`}
              type="button"
              aria-expanded={active}
              aria-controls={`mobile-service-panel-${service.key}`}
              onClick={() => setActiveIndex((current) => current === index ? null : index)}
              className={`flex min-h-16 w-full items-center gap-3 py-4 text-left transition-colors ${
                active ? "text-[#AE2422]" : "text-[#313152]"
              }`}
            >
              <span className={`w-6 shrink-0 text-xs font-extrabold tabular-nums ${
                active ? "text-[#AE2422]" : "text-[#9A9AA7]"
              }`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <Icon aria-hidden="true" size={21} strokeWidth={1.8} className="shrink-0" />
              <span className="min-w-0 flex-1 font-bold">{service.title}</span>
              <ChevronRight
                aria-hidden="true"
                size={18}
                className={`shrink-0 transition-transform duration-300 ${active ? "rotate-90" : ""}`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none ${
                active
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
              aria-hidden={!active}
              inert={!active}
            >
              <div className="min-h-0 overflow-hidden">
                <section
                  id={`mobile-service-panel-${service.key}`}
                  role="region"
                  aria-labelledby={`mobile-service-control-${service.key}`}
                  className="pb-5 pt-3"
                >
                  <ServiceDetails
                    service={service}
                    content={content}
                    visual={visual}
                    locale={locale}
                    mobile
                  />
                </section>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
