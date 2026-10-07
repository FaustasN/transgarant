"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, scrollBehavior, scrollToSection, useGsapScope } from "@/lib/motion";
import { getPagePath } from "@/lib/routing/paths.mjs";
import LanguageDropdown from "@/components/layout/LanguageDropdown";
import MobileNav from "@/components/layout/MobileNav";

const navKeys = ["services", "destinations", "about", "careers", "contact", "quote"];

export default function Header({ locale, nav, labels }) {
  const headerRef = useRef(null);
  const navItems = navKeys.map((key) => {
    const hash = key === "destinations" ? "kryptys" : undefined;

    return {
      key,
      href: hash ? `/${locale}#${hash}` : getPagePath(key, locale),
      label: nav[key],
      hash,
    };
  });

  function handleAnchorClick(event, item) {
    if (item.hash && scrollToSection(item.hash, locale)) event.preventDefault();
  }

  function handleLogoClick(event) {
    const homePath = `/${locale}`;
    if (window.location.pathname.replace(/\/$/, "") !== homePath) return;

    event.preventDefault();
    window.history.replaceState(null, "", homePath);
    window.scrollTo({ top: 0, behavior: scrollBehavior() });
  }

  useGsapScope(headerRef, (header) => {
    gsap
      .timeline({ defaults: { ease: "power2.out" } })
      .from(header, {
        autoAlpha: 0,
        duration: 0.3,
        clearProps: "opacity,visibility",
      })
      .from(
        "[data-header-nav-item], [data-header-action]",
        { y: -5, autoAlpha: 0, duration: 0.22, stagger: 0.035 },
        "-=0.2",
      );
  });

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[#E3E2E7] bg-white">
      <div className="relative mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href={`/${locale}`}
          onClick={handleLogoClick}
          aria-label={labels.homeLabel}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/Transgarant_be prieraso.png"
            alt="TRANSGARANT GROUP"
            width={1182}
            height={330}
            priority
            className="h-auto w-[150px] sm:w-[190px] lg:w-[235px]"
          />
        </Link>

        <nav aria-label={labels.navigationLabel} className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              data-header-nav-item
              data-analytics-event={item.key === "quote" ? "cta_click" : undefined}
              data-analytics-cta-id={item.key === "quote" ? "header_quote" : undefined}
              data-analytics-placement={item.key === "quote" ? "desktop_header" : undefined}
              data-analytics-destination={item.key === "quote" ? item.href : undefined}
              key={item.href}
              href={item.href}
              onClick={(event) => handleAnchorClick(event, item)}
              className="relative inline-flex items-center gap-1 py-2 text-[15px] font-semibold text-[#313152] transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#AE2422] after:transition-transform after:duration-200 hover:text-[#AE2422] hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div data-header-action className="hidden lg:block">
            <LanguageDropdown locale={locale} />
          </div>
          <div>
            <MobileNav navItems={navItems} labels={labels.mobile} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
