"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu } from "lucide-react";

export default function MobileNav({ navItems, labels }) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

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
        className={`fixed inset-0 z-[60] transition-[visibility] duration-300 ${
          open ? "visible" : "invisible delay-300"
        }`}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label={labels.close}
          tabIndex={open ? 0 : -1}
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-[#191925]/55 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          id="mobile-navigation-drawer"
          role="dialog"
          aria-modal="true"
          aria-label={labels.navigation}
          className={`absolute right-0 top-0 flex h-full w-[min(86vw,380px)] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#E3E2E7] px-5">
            <span className="ml-4 text-sm font-extrabold uppercase tracking-[0.12em] text-[#313152]">
              {labels.navigation}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              aria-label={labels.close}
              onClick={() => setOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#E3E2E7] bg-white text-[#313152] hover:border-[#313152]"
            >
              <ArrowRight aria-hidden="true" size={22} />
            </button>
          </div>

          <nav aria-label={labels.navigation} className="flex flex-1 flex-col gap-1 overflow-y-auto px-5 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
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
