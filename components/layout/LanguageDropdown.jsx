"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { getLocalizedPath } from "@/lib/routing/paths.mjs";

const languages = [
  { code: "lt", label: "LT", name: "Lietuvių" },
  { code: "en", label: "EN", name: "English" },
  { code: "pl", label: "PL", name: "Polski" },
  { code: "ru", label: "RU", name: "Русский" },
  { code: "de", label: "DE", name: "Deutsch" },
  { code: "fr", label: "FR", name: "Français" },
];

export default function LanguageDropdown({ locale = "lt" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const menuRef = useRef(null);
  const chevronRef = useRef(null);
  const pathname = usePathname();
  const current = locale.toUpperCase();

  useLayoutEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;

    gsap.set(menu, {
      autoAlpha: 0,
      y: -8,
      scale: 0.98,
      pointerEvents: "none",
      transformOrigin: "top right",
    });
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    const chevron = chevronRef.current;
    if (!menu || !chevron) return;

    gsap.to(menu, {
      autoAlpha: open ? 1 : 0,
      y: open ? 0 : -8,
      scale: open ? 1 : 0.98,
      pointerEvents: open ? "auto" : "none",
      duration: open ? 0.22 : 0.16,
      ease: open ? "power2.out" : "power1.in",
      overwrite: true,
    });
    gsap.to(chevron, {
      rotate: open ? 180 : 0,
      duration: 0.2,
      ease: "power2.out",
      overwrite: true,
    });

    return () => {
      gsap.killTweensOf([menu, chevron]);
    };
  }, [open]);

  useEffect(() => {
    function closeMenu(event) {
      if (event.key === "Escape" || !rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeMenu);
    document.addEventListener("keydown", closeMenu);

    return () => {
      document.removeEventListener("pointerdown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, []);

  function localizedPath(language) {
    return getLocalizedPath(pathname, language);
  }

  return (
    <div ref={rootRef} className="relative w-[72px]">
      <button
        type="button"
        aria-label={`Language: ${current}`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-md border border-[#E3E2E7] bg-white px-3 text-sm font-semibold text-[#313152] shadow-sm transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#313152] hover:shadow-md active:translate-y-0"
      >
        {current}
        <ChevronDown ref={chevronRef} aria-hidden="true" size={14} strokeWidth={2} />
      </button>

      <div
        ref={menuRef}
        aria-hidden={!open}
        className="invisible absolute right-0 z-50 mt-2 w-full overflow-hidden rounded-lg border border-[#E3E2E7] bg-white opacity-0 shadow-md"
      >
        {languages.map((language) => (
          <Link
            key={language.code}
            href={localizedPath(language.code)}
            lang={language.code}
            hrefLang={language.code}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            aria-current={language.code === locale ? "page" : undefined}
            aria-label={language.name}
            className="block w-full px-3 py-2 text-left text-sm font-semibold text-[#313152] transition-[background-color,padding] duration-150 hover:bg-[#E9E9F0] hover:pl-4"
          >
            {language.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
