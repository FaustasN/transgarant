"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Container,
  PackageOpen,
  Route,
  Ship,
  Snowflake,
  Truck,
  Warehouse,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const serviceVisuals = {
  road: {
    icon: Truck,
    image: "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1600&q=85",
  },
  special: {
    icon: Snowflake,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=85",
  },
  global: {
    icon: Ship,
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=85",
  },
  warehouse: {
    icon: Warehouse,
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=1600&q=85",
  },
  moving: {
    icon: PackageOpen,
    image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1600&q=85",
  },
  forwarding: {
    icon: Route,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=85",
  },
};

function ServiceDetails({ service, content, visual, locale, mobile = false }) {
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
        href={`/${locale}/uzklausa`}
        className="mt-6 inline-flex min-h-12 items-center gap-3 font-bold text-[#313152] transition-colors hover:text-[#AE2422]"
      >
        {content.explorer.cta}
        <ArrowRight aria-hidden="true" size={18} className="text-[#AE2422]" />
      </Link>
    </>
  );
}

export default function ServicesExperience({ locale, content }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const animatingRef = useRef(false);
  const heroRef = useRef(null);
  const explorerRef = useRef(null);
  const panelsRef = useRef([]);
  const buttonsRef = useRef([]);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from("[data-service-page-reveal]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
      });

      gsap.from(buttonsRef.current.filter(Boolean), {
        y: 10,
        autoAlpha: 0,
        duration: 0.45,
        stagger: 0.055,
        ease: "power2.out",
        scrollTrigger: { trigger: explorerRef.current, start: "top 82%", once: true },
      });

      gsap.from(panelsRef.current[0], {
        y: 22,
        autoAlpha: 0,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: explorerRef.current, start: "top 78%", once: true },
      });
    }, heroRef);

    return () => context.revert();
  }, []);

  function selectService(nextIndex) {
    const currentIndex = activeIndexRef.current;
    if (nextIndex === currentIndex || animatingRef.current) return;

    const currentPanel = panelsRef.current[currentIndex];
    const nextPanel = panelsRef.current[nextIndex];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
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
                      className="pb-10 pt-3"
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
