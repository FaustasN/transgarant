"use client";

import { buildAnalyticsEvent, dispatchAnalyticsEvent } from "./core.mjs";

let analyticsEnabled = false;

export function setAnalyticsEnabled(enabled) {
  analyticsEnabled = enabled === true;
}

export function trackAnalyticsEvent(name, parameters) {
  if (!analyticsEnabled || typeof window === "undefined") return false;
  return dispatchAnalyticsEvent(window.gtag, buildAnalyticsEvent(name, parameters));
}
