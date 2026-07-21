"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";
import gsap from "gsap";

export default function ScrollToTop() {
  const buttonRef = useRef(null);
  const visibleRef = useRef(false);

  useLayoutEffect(() => {
    gsap.set(buttonRef.current, {
      autoAlpha: 0,
      y: 12,
      pointerEvents: "none",
    });
  }, []);

  useEffect(() => {
    function updateVisibility() {
      const visible = window.scrollY > 500;
      if (visible === visibleRef.current) return;

      visibleRef.current = visible;
      gsap.to(buttonRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 12,
        pointerEvents: visible ? "auto" : "none",
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.25,
        ease: "power2.out",
        overwrite: true,
      });
    }

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className="fixed bottom-5 right-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/15 bg-[#313152] text-white opacity-0 shadow-[0_10px_30px_rgba(25,25,37,0.22)] transition-[background-color,transform] duration-200 hover:-translate-y-1 hover:bg-[#AE2422] active:translate-y-0 sm:bottom-7 sm:right-7"
    >
      <ArrowUp aria-hidden="true" size={20} strokeWidth={2.2} />
    </button>
  );
}
