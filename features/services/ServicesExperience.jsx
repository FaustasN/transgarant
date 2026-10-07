"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChevronRight, Container } from "lucide-react";
import { gsap, prefersReducedMotion, useGsapScope } from "@/lib/motion";
import ServiceDetails from "./ServiceDetails";
import { serviceVisuals } from "./serviceVisuals";

export default function ServicesExperience({ locale, content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const heroRef = useRef(null);
  const explorerRef = useRef(null);
  const panelsRef = useRef([]);
  const buttonsRef = useRef([]);

  useGsapScope(heroRef, () => {
    const explorer = explorerRef.current;
    const buttons = buttonsRef.current.filter(Boolean);
    const firstPanel = panelsRef.current[0];
    if (!explorer) return;

    gsap.from("[data-service-page-reveal]", {
      y: 20,
      autoAlpha: 0,
      duration: 0.55,
      stagger: 0.08,
      ease: "power3.out",
    });

    if (buttons.length) {
      gsap.from(buttons, {
        y: 10,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.055,
        ease: "power2.out",
        scrollTrigger: { trigger: explorer, start: "top 82%", once: true },
      });
    }

    if (firstPanel) {
      gsap.from(firstPanel, {
        y: 22,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: explorer, start: "top 78%", once: true },
      });
    }
  });

  function selectService(nextIndex) {
    const currentIndex = activeIndexRef.current;
    if (nextIndex === currentIndex || animatingRef.current) return;

    const currentPanel = panelsRef.current[currentIndex];
    const nextPanel = panelsRef.current[nextIndex];

    if (prefersReducedMotion() || !currentPanel || !nextPanel) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      animatingRef.current = false;
      return;
    }

    animatingRef.current = true;
    gsap.killTweensOf([currentPanel, nextPanel]);
    gsap.set([currentPanel, nextPanel], { y: 0 });

    gsap.to(currentPanel, {
      autoAlpha: 0,
      duration: 0.38,
      ease: "power1.inOut",
      overwrite: true,
      onComplete: () => {
        activeIndexRef.current = nextIndex;
        flushSync(() => {
          setActiveIndex(nextIndex);
        });

        gsap.set(currentPanel, { autoAlpha: 1 });
        gsap.fromTo(nextPanel, { autoAlpha: 0 }, {
          autoAlpha: 1,
          duration: 0.55,
          ease: "power1.inOut",
          overwrite: true,
          onComplete: () => {
            animatingRef.current = false;
          },
        });
      },
    });
  }

  function handleTabKeyDown(event, index) {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();

    let nextIndex = index;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = content.services.length - 1;
    else if (["ArrowDown", "ArrowRight"].includes(event.key)) nextIndex = (index + 1) % content.services.length;
    else nextIndex = (index - 1 + content.services.length) % content.services.length;

    selectService(nextIndex);
    buttonsRef.current[nextIndex]?.focus();
  }

  return (
    <main ref={heroRef}>
      <section ref={explorerRef} id="paslaugu-sarasas" className="scroll-mt-20 bg-[#F6F5F2] px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-22">
        <div className="mx-auto max-w-[1200px]">
          <nav data-service-page-reveal aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#6F7080]">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#AE2422]">{content.hero.breadcrumbHome}</Link>
            <ChevronRight aria-hidden="true" size={14} />
            <span aria-current="page" className="font-semibold text-[#313152]">{content.hero.breadcrumbCurrent}</span>
          </nav>
          <div className="max-w-3xl">
            <h1 className="mt-4 text-[clamp(36px,4.5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">{content.explorer.title}</h1>
            <p className="mt-5 text-base leading-8 text-[#6F7080] sm:text-lg">{content.explorer.intro}</p>
          </div>

          <div className="mt-12 border-t border-[#D9D8DE] lg:hidden">
            {content.services.map((service, index) => {
              const Icon = serviceVisuals[service.key]?.icon ?? Container;
              const visual = serviceVisuals[service.key] ?? serviceVisuals.road;
              const active = mobileActiveIndex === index;
              return (
                <div key={service.key} className="border-b border-[#D9D8DE]">
                  <button
                    id={`mobile-service-control-${service.key}`}
                    type="button"
                    aria-expanded={active}
                    aria-controls={`mobile-service-panel-${service.key}`}
                    onClick={() => setMobileActiveIndex((current) => current === index ? null : index)}
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

          <div className="mt-14 hidden gap-16 lg:grid lg:grid-cols-[310px_minmax(0,1fr)]">
            <div className="relative">
              <div
                role="tablist"
                aria-label={content.explorer.navigationLabel}
                className="sticky top-28"
              >
                {content.services.map((service, index) => {
                  const Icon = serviceVisuals[service.key]?.icon ?? Container;
                  const active = activeIndex === index;
                  return (
                    <div key={service.key} className="transition-[padding] duration-200 ease-out hover:py-2">
                      <button
                        ref={(element) => { buttonsRef.current[index] = element; }}
                        id={`desktop-service-tab-${service.key}`}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        aria-controls={`desktop-service-panel-${service.key}`}
                        tabIndex={active ? 0 : -1}
                        onClick={() => selectService(index)}
                        onKeyDown={(event) => handleTabKeyDown(event, index)}
                        className={`group relative flex w-full items-center gap-3 border-b px-4 py-4 text-left transition-[color,background-color,border-color,transform,box-shadow] duration-200 ease-out hover:-translate-y-1 hover:bg-white hover:text-[#AE2422] hover:shadow-[0_12px_28px_rgba(49,49,82,0.12)] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AE2422] ${
                          active
                            ? "border-[#AE2422] bg-white text-[#AE2422]"
                            : "border-[#D9D8DE] text-[#313152] hover:border-[#AE2422]/45"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`absolute inset-y-3 left-0 w-[3px] bg-[#AE2422] transition-transform duration-200 ${
                            active ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                          }`}
                        />
                        <span className={`text-xs font-extrabold tabular-nums ${
                          active ? "text-[#AE2422]" : "text-[#9A9AA7] group-hover:text-[#AE2422]"
                        }`}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Icon aria-hidden="true" size={20} strokeWidth={1.8} className="shrink-0" />
                        <span className="min-w-0 flex-1 font-bold">{service.title}</span>
                        <ChevronRight
                          aria-hidden="true"
                          size={17}
                          className={`transition-transform duration-200 ${
                            active ? "translate-x-1" : "group-hover:translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="min-w-0 border-t border-[#D9D8DE] pt-8">
              {content.services.map((service, index) => {
                const visual = serviceVisuals[service.key] ?? serviceVisuals.road;
                return (
                  <article
                    key={service.key}
                    ref={(element) => { panelsRef.current[index] = element; }}
                    id={`desktop-service-panel-${service.key}`}
                    role="tabpanel"
                    aria-labelledby={`desktop-service-tab-${service.key}`}
                    style={{ display: activeIndex === index ? "block" : "none" }}
                  >
                    <ServiceDetails
                      service={service}
                      content={content}
                      visual={visual}
                      locale={locale}
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
