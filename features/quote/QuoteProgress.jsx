"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { requiredFields } from "@/lib/validation/quote";

const sectionFields = [
  ["contactPerson", "phone"],
  ["loadingAddress", "unloadingAddress"],
  ["cargoType", "weight"],
];

// Tracks which required fields are filled, per form section, and whether the
// mobile progress bar should show (the form was touched and is on screen).
export function useQuoteProgress(formRef) {
  const [filled, setFilled] = useState([]);
  const [started, setStarted] = useState(false);
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return undefined;

    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting));
    observer.observe(form);

    return () => observer.disconnect();
  }, [formRef]);

  const sectionProgress = sectionFields.map(
    (names) => names.filter((name) => filled.includes(name)).length / names.length,
  );
  const sectionsDone = sectionProgress.filter((value) => value === 1).length;

  return {
    sectionProgress,
    allDone: sectionsDone === sectionFields.length,
    sectionsDone,
    completed: filled.length,
    total: requiredFields.length,
    visible: started && formInView,
    update(form) {
      setFilled(
        requiredFields.filter((name) => String(form.elements.namedItem(name)?.value ?? "").trim()),
      );
      setStarted(true);
    },
    reset() {
      setFilled([]);
      setStarted(false);
    },
  };
}

export default function QuoteProgress({ progress, content }) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const { sectionProgress, sectionsDone, allDone, completed, total, visible } = progress;
  const sectionLabels = [content.contactEyebrow, content.routeEyebrow, content.cargoEyebrow];
  const currentSection = Math.min(sectionsDone, sectionFields.length - 1);

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out lg:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="pointer-events-auto border-t border-[#E3E2E7] bg-white/92 px-5 pb-3 pt-2.5 backdrop-blur sm:px-7">
        <div
          role="progressbar"
          aria-label={content.progress}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={completed}
          className="flex gap-1.5"
        >
          {sectionProgress.map((value, index) => (
            <span key={index} className="h-1 flex-1 overflow-hidden bg-[#E3E2E7]">
              <span
                className={`block h-full transition-[width] duration-300 ease-out ${allDone ? "bg-green-600" : "bg-[#AE2422]"}`}
                style={{ width: `${value * 100}%` }}
              />
            </span>
          ))}
        </div>
        <p
          role="status"
          className="mt-2 flex items-baseline justify-between gap-3 text-[11px] font-semibold tabular-nums text-[#6F7080]"
        >
          <span className="truncate uppercase tracking-[0.12em]">
            {allDone ? content.progressDone : sectionLabels[currentSection]}
          </span>
          <span>
            {completed} / {total}
          </span>
        </p>
      </div>
    </div>,
    document.body,
  );
}
