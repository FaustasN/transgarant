"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function RevealSection({ children, className = "", id, itemStagger = 0.12 }) {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const revealElements = sectionRef.current.querySelectorAll("[data-reveal]");
      const revealItems = sectionRef.current.querySelectorAll("[data-reveal-item]");

      if (revealElements.length) {
        gsap.from(revealElements, {
          y: 30,
          autoAlpha: 0,
          duration: 0.75,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }

      if (revealItems.length) {
        gsap.from(revealItems, {
          y: 36,
          autoAlpha: 0,
          duration: 0.7,
          stagger: itemStagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: revealItems[0],
            start: "top 86%",
            once: true,
          },
        });
      }

      sectionRef.current.querySelectorAll("[data-parallax]").forEach((element) => {
        gsap.fromTo(element, { yPercent: -4, scale: 1.06 }, {
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
          },
        });
      });
    }, sectionRef);

    return () => context.revert();
  }, [itemStagger]);

  return <section ref={sectionRef} id={id} className={className}>{children}</section>;
}
