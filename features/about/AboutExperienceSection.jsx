"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutExperienceSection({ content }) {
  const sectionRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const detailsRef = useRef(null);

  useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      const section = sectionRef.current;
      const eyebrow = eyebrowRef.current;
      const heading = headingRef.current;
      const details = detailsRef.current;
      if (!section || !eyebrow || !heading || !details) return;

      const elements = [eyebrow, heading, details];
      const context = gsap.context(() => {
        gsap.set(elements, { autoAlpha: 0 });

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "top 20%",
            scrub: 0.45,
            onLeave: () => gsap.set(elements, { autoAlpha: 1 }),
          },
        })
          .to(eyebrow, {
            autoAlpha: 1,
            duration: 0.2,
            ease: "none",
          })
          .to(heading, {
            autoAlpha: 1,
            duration: 0.42,
            ease: "none",
          }, "+=0.08")
          .to(details, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "none",
          }, "-=0.2");
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white px-5 py-14 sm:px-8 lg:px-10 lg:py-20"
    >
      <div className="mx-auto grid max-w-[1200px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 xl:gap-32">
        <div className="lg:flex lg:flex-col">
          <p
            ref={eyebrowRef}
            className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#AE2422]"
          >
            {content.eyebrow}
          </p>
          <h2
            ref={headingRef}
            className="mt-5 text-[clamp(36px,4vw,52px)] font-extrabold leading-[1.02] tracking-[-0.04em] text-balance"
          >
            {content.title}
          </h2>
          <div className="hidden lg:mt-auto lg:block lg:pt-12">
            <Image
              src="/certificates/certificate.jpg"
              alt={content.badgeAlt}
              width={788}
              height={227}
              sizes="440px"
              className="h-auto w-full max-w-[440px] rounded-lg"
            />
          </div>
        </div>

        <div ref={detailsRef}>
          <div className="space-y-5 text-base leading-8 text-[#6F7080] sm:text-lg">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="mt-9 border-l-[3px] border-[#AE2422] py-2 pl-6 text-xl font-bold leading-8 text-[#313152] sm:text-2xl sm:leading-9">
            {content.highlight}
          </blockquote>
        </div>
      </div>
    </section>
  );
}
