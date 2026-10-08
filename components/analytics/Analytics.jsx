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
  setAnalyticsEnabled,
  trackAnalyticsEvent,
} from "@/lib/analytics/core.mjs";
import ConsentBanner from "./ConsentBanner";

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
    <button type="button" data-analytics-preferences className={className}>
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
      if (target?.closest("[data-analytics-preferences]")) {
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

  const showBanner = hydrated && (consent === null || preferencesOpen);

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

      {showBanner ? (
        <ConsentBanner content={content} onAccept={acceptAnalytics} onDecline={declineAnalytics} />
      ) : null}
    </>
  );
}
