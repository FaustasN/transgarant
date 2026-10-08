"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { resources } from "@/lib/i18n/resources";

import EuropeMap from "./EuropeMap";

gsap.registerPlugin(ScrollTrigger);

export default function Destinations({ locale = "lt" }) {
  const destinations = (resources[locale] ?? resources.lt).common.destinations;
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const mapRef = useRef(null);
  const detailsRef = useRef(null);
  const activeRegion = destinations.regions[activeIndex];
  const countriesText = activeRegion.countries.join(", ");
  const hasLongCountryList = countriesText.length > 85;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % destinations.regions.length);
    }, 4200);

    return () => window.clearTimeout(timer);
  }, [activeIndex, destinations.regions.length]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const section = sectionRef.current;
    const heading = headingRef.current;
    const map = mapRef.current;
    const details = detailsRef.current;
    if (!section || !heading || !map || !details) return;

    const context = gsap.context(() => {
      gsap.from(heading, {
        autoAlpha: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: { trigger: heading, start: "top 88%", once: true },
      });
      gsap.from([map, details], {
        y: 36, autoAlpha: 0, duration: 0.75, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: map, start: "top 84%", once: true },
      });
    }, section);
    return () => context.revert();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const details = detailsRef.current;
    if (!details?.children.length) return;

    const children = Array.from(details.children);
    gsap.fromTo(children, { y: 8, autoAlpha: 0 }, {
      y: 0, autoAlpha: 1, duration: 0.35, stagger: 0.04, ease: "power2.out", overwrite: true,
    });

    return () => gsap.killTweensOf(children);
  }, [activeIndex]);

  return (
    <section ref={sectionRef} id="kryptys" className="bg-white px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <div ref={headingRef} className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]">
            {destinations.eyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1] tracking-[-0.035em] text-[#191925] text-balance">
            {destinations.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#6F7080] sm:text-lg">
            {destinations.intro}
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-[1050px] overflow-hidden rounded-2xl border border-[#D9D8E0] bg-[#313152] shadow-[0_20px_55px_rgba(25,25,37,0.12)]">
          <div ref={mapRef}>
            <EuropeMap activeIndex={activeIndex} regions={destinations.regions} origin={destinations.origin} mapLabel={destinations.mapLabel} />
          </div>

          <div className="flex h-[190px] items-center overflow-hidden border-t border-white/14 px-7 py-6 text-center text-white sm:h-[170px] sm:px-10 sm:py-7">
            <div ref={detailsRef} className="mx-auto w-full max-w-3xl" aria-live="polite">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/48">
                {destinations.countriesLabel}
              </p>
              <h3 className="mt-3 text-xl font-bold">{activeRegion.title}</h3>
              <p
                className={`mt-3 text-white/68 ${
                  hasLongCountryList
                    ? "text-[11px] leading-5 sm:text-xs sm:leading-6"
                    : "text-xs leading-6 sm:text-sm sm:leading-7"
                }`}
              >
                {countriesText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
