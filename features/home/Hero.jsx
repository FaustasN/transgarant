"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Check } from "lucide-react";
import { gsap, scrollToSection, useGsapScope } from "@/lib/motion";
import { getPagePath } from "@/lib/routing/paths.mjs";
import { ctaProps } from "@/lib/analytics/core.mjs";

export default function Hero({ locale, content: hero }) {
  const sectionRef = useRef(null);

  function handleServicesClick(event) {
    if (scrollToSection("paslaugos", locale)) event.preventDefault();
  }

  useGsapScope(sectionRef, () => {
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .from("[data-hero-title-primary]", { y: 22, autoAlpha: 0, duration: 0.45 })
      .from("[data-hero-title-secondary]", { y: 18, autoAlpha: 0, duration: 0.4 }, "-=0.34")
      .from("[data-hero-description]", { y: 16, autoAlpha: 0, duration: 0.36 }, "-=0.27")
      .from("[data-hero-button]", { y: 12, autoAlpha: 0, duration: 0.3 }, "-=0.23")
      .from(
        "[data-hero-highlight]",
        { y: 10, autoAlpha: 0, duration: 0.3, stagger: 0.06 },
        "-=0.15",
      );
  });

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-[#191925] text-white">
      <Image
        src="/heroImage.webp"
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="-z-20 scale-[1.02] object-cover object-[66%_center] sm:object-[58%_center] lg:object-center"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(18,18,31,0.97)_0%,rgba(24,24,38,0.88)_42%,rgba(24,24,38,0.38)_72%,rgba(24,24,38,0.18)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(18,18,31,0.68)_0%,transparent_45%)]" />

      <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-[1280px] flex-col justify-between px-5 py-10 sm:px-8 sm:py-16 lg:min-h-[720px] lg:px-10 lg:py-20">
        <div className="my-auto max-w-[680px] py-8">
          <h1 className="max-w-[700px] font-extrabold leading-[0.94] tracking-[-0.04em] text-balance">
            <span data-hero-title-primary className="block text-[clamp(46px,6.2vw,82px)]">
              {hero.titlePrimary}
            </span>
            <span
              data-hero-title-secondary
              className="mt-2 block text-[clamp(28px,3.4vw,46px)] text-white/88"
            >
              {hero.titleSecondary}
            </span>
          </h1>
          <p
            data-hero-description
            className="mt-7 max-w-[620px] text-lg leading-8 text-white/78 sm:text-xl sm:leading-9"
          >
            {hero.description}
          </p>

          <div className="mt-9 flex flex-row items-center gap-2.5 sm:gap-3">
            <Link
              data-hero-button
              {...ctaProps("hero_quote", "home_hero", getPagePath("quote", locale))}
              href={getPagePath("quote", locale)}
              className="inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#AE2422] px-3.5 py-3 text-sm font-bold text-white transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#92201E] hover:shadow-lg active:translate-y-0 sm:min-h-13 sm:gap-3 sm:px-7 sm:py-3.5 sm:text-base"
            >
              {hero.primaryCta}
              <ArrowRight aria-hidden="true" size={18} className="hidden sm:block" />
            </Link>
            <Link
              data-hero-button
              {...ctaProps("hero_services", "home_hero", `/${locale}#paslaugos`)}
              href={`/${locale}#paslaugos`}
              onClick={handleServicesClick}
              className="inline-flex min-h-12 items-center justify-center whitespace-nowrap rounded-lg border border-white/38 bg-white/[0.06] px-3.5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-lg active:translate-y-0 sm:min-h-13 sm:px-7 sm:py-3.5 sm:text-base"
            >
              {hero.secondaryCta}
            </Link>
          </div>
        </div>

        <div className="translate-y-4 grid gap-2 border-t border-white/20 pt-5 text-[13px] font-semibold text-white/80 md:translate-y-6 md:grid-cols-3 md:gap-6 md:pt-6 md:text-sm">
          {hero.highlights.map((highlight) => (
            <div
              data-hero-highlight
              key={highlight}
              className="grid w-full grid-cols-[20px_minmax(0,1fr)] items-center gap-2.5 text-left md:flex md:justify-center md:text-center"
            >
              <Check aria-hidden="true" size={17} className="shrink-0 text-[#E24A46]" strokeWidth={2.5} />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
