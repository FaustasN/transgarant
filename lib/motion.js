import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap };

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function scrollBehavior() {
  return prefersReducedMotion() ? "auto" : "smooth";
}

// Scrolls to the section with this id and mirrors it in the URL; false if it is not on the page.
export function scrollToSection(id, locale) {
  const section = document.getElementById(id);
  if (!section) return false;

  section.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  window.history.replaceState(null, "", `/${locale}#${id}`);
  return true;
}

// Runs `build(scopeElement)` inside a gsap context that is reverted on cleanup.
// Skipped entirely for visitors who prefer reduced motion.
export function useGsapScope(ref, build, deps = []) {
  useLayoutEffect(() => {
    const scope = ref.current;
    if (!scope || prefersReducedMotion()) return;

    const context = gsap.context(() => build(scope), scope);

    return () => context.revert();
    // The caller owns `deps`; `build` closes over refs and stable values only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
