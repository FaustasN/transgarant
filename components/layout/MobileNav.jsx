"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { gsap, prefersReducedMotion, scrollBehavior } from "@/lib/motion";
import LanguageDropdown from "@/components/layout/LanguageDropdown";

export default function MobileNav({ navItems, labels, locale }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);
  const overlayRef = useRef(null);
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);
  const navRef = useRef(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const drawer = drawerRef.current;
    if (!overlay || !backdrop || !drawer) return;

    gsap.set(overlay, { visibility: "hidden", pointerEvents: "none" });
    gsap.set(backdrop, { autoAlpha: 0 });
    gsap.set(drawer, { xPercent: 100 });
  }, []);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const backdrop = backdropRef.current;
    const drawer = drawerRef.current;
    const navElements = navRef.current ? Array.from(navRef.current.children) : [];
    if (!overlay || !backdrop || !drawer) return;

    const duration = prefersReducedMotion() ? 0 : 0.24;
    const timeline = gsap.timeline({ defaults: { overwrite: true } });
    if (open) {
      timeline.set(overlay, { visibility: "visible", pointerEvents: "auto" })
        .to(backdrop, { autoAlpha: 1, duration: duration * 0.45 })
        .to(drawer, { xPercent: 0, duration, ease: "power3.out", force3D: true }, 0);
      if (navElements.length) {
        timeline.fromTo(
          navElements,
          { x: 14, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: duration * 0.7, stagger: 0.025, ease: "power2.out" },
          duration * 0.2,
        );
      }
    } else {
      timeline.set(overlay, { pointerEvents: "none" })
        .to(backdrop, { autoAlpha: 0, duration: 0.06 })
        .to(drawer, { xPercent: 100, duration: duration * 0.75, ease: "power2.in", force3D: true }, 0)
        .set(overlay, { visibility: "hidden" });
    }
    if (!open) return () => timeline.kill();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      timeline.kill();
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleNavClick(event, item) {
    const section = item.hash ? document.getElementById(item.hash) : null;
    setOpen(false);
    if (!section) return;

    event.preventDefault();
    window.history.replaceState(null, "", `/${locale}#${item.hash}`);
    window.requestAnimationFrame(() => {
      section.scrollIntoView({
        behavior: scrollBehavior(),
        block: "start",
      });
    });
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={labels.open}
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        onClick={() => setOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E3E2E7] bg-white text-[#313152] hover:border-[#313152]"
      >
        <Menu aria-hidden="true" size={22} />
      </button>

      <div
        ref={overlayRef}
        className="invisible fixed inset-0 z-[60]"
        aria-hidden={!open}
      >
        <button
          ref={backdropRef}
          type="button"
          aria-label={labels.close}
          tabIndex={open ? 0 : -1}
          onClick={closeDrawer}
          className="absolute inset-0 bg-[#191925]/50 will-change-opacity"
        />

        <div
          ref={drawerRef}
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={labels.navigation}
          className="absolute right-0 top-0 flex h-dvh w-[min(88vw,390px)] transform-gpu flex-col bg-white shadow-2xl will-change-transform"
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#E3E2E7] px-5">
            <span className="ml-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[#313152]">
              {labels.navigation}
            </span>
            <div className="flex items-center gap-2">
              <LanguageDropdown locale={locale} />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={labels.close}
                onClick={closeDrawer}
                className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E3E2E7] bg-white text-[#313152] transition-colors hover:border-[#313152]"
              >
                <ArrowRight aria-hidden="true" size={22} />
              </button>
            </div>
          </div>

          <nav ref={navRef} aria-label={labels.navigation} className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                data-analytics-event={item.key === "quote" ? "cta_click" : undefined}
                data-analytics-cta-id={item.key === "quote" ? "header_quote" : undefined}
                data-analytics-placement={item.key === "quote" ? "mobile_navigation" : undefined}
                data-analytics-destination={item.key === "quote" ? item.href : undefined}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={(event) => handleNavClick(event, item)}
                className="rounded-md px-4 py-4 text-lg font-semibold text-[#313152] transition-colors hover:bg-[#E9E9F0]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
