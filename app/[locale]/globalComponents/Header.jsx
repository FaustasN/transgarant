"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { resources } from "@/lib/i18n";
import LanguageDropdown from "./LanguageDropdown";
import MobileNav from "./MobileNav";

const navDestinations = [
  { key: "services", path: "", hash: "paslaugos" },
  { key: "destinations", path: "", hash: "kryptys" },
  { key: "about", path: "/apie-mus" },
  { key: "careers", path: "/karjera" },
  { key: "contact", path: "/kontaktai" },
  { key: "quote", path: "/uzklausa" },
];

export default function Header({ locale = "lt" }) {
  const headerRef = useRef(null);
  const dictionary = resources[locale]?.common ?? resources.lt.common;
  const navItems = navDestinations.map((destination) => ({
    href: `/${locale}${destination.path}${destination.hash ? `#${destination.hash}` : ""}`,
    label: dictionary.nav[destination.key],
  }));

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

      timeline
        .from(headerRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          clearProps: "opacity,visibility",
        })
        .from(
          "[data-header-nav-item], [data-header-action]",
          { y: -5, autoAlpha: 0, duration: 0.22, stagger: 0.035 },
          "-=0.2",
        );
    }, headerRef);

    return () => context.revert();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-[#E3E2E7] bg-white">
      <div className="relative mx-auto flex h-20 max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10">
        <Link
          href={`/${locale}`}
          aria-label={dictionary.header.homeLabel}
          className="flex shrink-0 items-center"
        >
          <Image
            src="/Transgarant_be prieraso.png"
            alt="TRANSGARANT GROUP"
            width={1182}
            height={330}
            priority
            className="h-auto w-[190px] sm:w-[235px]"
          />
        </Link>

        <nav aria-label={dictionary.header.navigationLabel} className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <Link
              data-header-nav-item
              key={item.href}
              href={item.href}
              className="relative inline-flex items-center gap-1 py-2 text-[15px] font-semibold text-[#313152] transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#AE2422] after:transition-transform after:duration-200 hover:text-[#AE2422] hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div data-header-action>
            <LanguageDropdown locale={locale} />
          </div>
          <div>
            <MobileNav navItems={navItems} labels={dictionary.header.mobile} />
          </div>
        </div>
      </div>
    </header>
  );
}
