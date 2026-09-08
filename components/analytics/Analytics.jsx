"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  buildPageViewEvent,
  dispatchAnalyticsEvent,
  getDeclarativeClickEvent,
  getGaCookieDeletionStrings,
  isNewPageView,
  parseAnalyticsConsent,
  serializeAnalyticsConsent,
} from "@/lib/analytics/core.mjs";
import { setAnalyticsEnabled, trackAnalyticsEvent } from "@/lib/analytics/client";

let warnedAboutConfiguration = false;
const subscribeToHydration = () => () => {};
const consentSubscribers = new Set();

function subscribeToConsent(callback) {
  consentSubscribers.add(callback);
  return () => consentSubscribers.delete(callback);
}

function readBrowserConsent() {
  return parseAnalyticsConsent(document.cookie);
}

function notifyConsentSubscribers() {
  for (const callback of consentSubscribers) callback();
}

function initializeGoogleAnalytics(measurementId) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };
    if (window.__transgarantAnalyticsMeasurementId !== measurementId) {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
      window.__transgarantAnalyticsMeasurementId = measurementId;
    }
    return true;
  } catch {
    return false;
  }
}

export function AnalyticsPreferencesButton({ enabled, label, className = "" }) {
  if (!enabled) return null;

  return (
    <button
      type="button"
      data-analytics-preferences
      className={className}
    >
      {label}
    </button>
  );
}

export default function Analytics({ measurementId, locale, content }) {
  const pathname = usePathname();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const consent = useSyncExternalStore(subscribeToConsent, readBrowserConsent, () => null);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [tagReady, setTagReady] = useState(false);
  const lastPagePath = useRef(null);

  useEffect(() => {
    if (!measurementId) {
      if (process.env.NODE_ENV !== "production" && !warnedAboutConfiguration) {
        warnedAboutConfiguration = true;
        console.warn("Google Analytics is disabled because its measurement ID is missing or invalid.");
      }
    }
  }, [measurementId]);

  useEffect(() => {
    const enabled = Boolean(measurementId && consent === "granted");
    setAnalyticsEnabled(enabled);

    return () => setAnalyticsEnabled(false);
  }, [consent, measurementId]);

  useEffect(() => {
    if (measurementId && consent === "granted") initializeGoogleAnalytics(measurementId);
  }, [consent, measurementId]);

  useEffect(() => {
    function handleDocumentClick(event) {
      const target = event.target instanceof Element ? event.target : null;
      const preferencesButton = target?.closest("[data-analytics-preferences]");
      if (preferencesButton) {
        setPreferencesOpen(true);
        return;
      }

      if (consent !== "granted") return;
      const analyticsTarget = target?.closest("[data-analytics-event]");
      if (!analyticsTarget) return;

      const eventData = getDeclarativeClickEvent({
        ...analyticsTarget.dataset,
        analyticsDestination:
          analyticsTarget.dataset.analyticsDestination
          || analyticsTarget.getAttribute("href")
          || undefined,
        analyticsLocale: analyticsTarget.dataset.analyticsLocale || locale,
      });
      if (eventData) trackAnalyticsEvent(eventData.name, eventData.parameters);
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [consent, locale]);

  useEffect(() => {
    if (consent !== "granted") {
      lastPagePath.current = null;
      return;
    }
    if (!tagReady || !isNewPageView(lastPagePath.current, pathname)) return;

    const eventData = buildPageViewEvent({
      pathname,
      origin: window.location.origin,
      title: document.title,
      locale,
    });
    if (dispatchAnalyticsEvent(window.gtag, eventData)) {
      lastPagePath.current = pathname;
    }
  }, [consent, locale, pathname, tagReady]);

  function storeConsent(value) {
    const cookie = serializeAnalyticsConsent(value, {
      secure: window.location.protocol === "https:",
    });
    if (cookie) document.cookie = cookie;
  }

  function acceptAnalytics() {
    storeConsent("granted");
    initializeGoogleAnalytics(measurementId);
    notifyConsentSubscribers();
    setPreferencesOpen(false);
  }

  function declineAnalytics() {
    const wasGranted = consent === "granted";
    storeConsent("denied");
    setAnalyticsEnabled(false);
    notifyConsentSubscribers();
    setPreferencesOpen(false);

    if (wasGranted) {
      for (const cookie of getGaCookieDeletionStrings(document.cookie, {
        hostname: window.location.hostname,
        secure: window.location.protocol === "https:",
      })) {
        document.cookie = cookie;
      }
      window.location.reload();
    }
  }

  if (!measurementId) return null;

  const showPreferences = hydrated && (consent === null || preferencesOpen);

  return (
    <>
      {consent === "granted" ? (
        <Script
          id="google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
          strategy="afterInteractive"
          onReady={() => setTagReady(true)}
          onError={() => setTagReady(false)}
        />
      ) : null}

      {showPreferences ? (
        <section
          role="region"
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-xl border border-[#D9D8DE] bg-white p-5 text-[#191925] shadow-[0_24px_70px_rgba(25,25,37,0.24)] sm:inset-x-6 sm:p-6"
        >
          <h2 id="analytics-consent-title" className="text-lg font-extrabold text-[#313152]">
            {content.title}
          </h2>
          <p id="analytics-consent-description" className="mt-2 text-sm leading-6 text-[#6F7080]">
            {content.description}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={declineAnalytics}
              className="min-h-12 rounded-lg bg-[#313152] px-5 py-3 font-bold text-white transition-colors hover:bg-[#252541]"
            >
              {content.decline}
            </button>
            <button
              type="button"
              onClick={acceptAnalytics}
              className="min-h-12 rounded-lg bg-[#AE2422] px-5 py-3 font-bold text-white transition-colors hover:bg-[#92201E]"
            >
              {content.accept}
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
