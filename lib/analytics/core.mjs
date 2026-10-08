export const ANALYTICS_CONSENT_COOKIE = "analytics_consent";
export const ANALYTICS_CONSENT_MAX_AGE = 15_552_000;

const consentValues = new Set(["granted", "denied"]);
const eventParameters = {
  page_view: ["page_path", "page_location", "page_title", "locale"],
  cta_click: ["cta_id", "placement", "destination", "locale"],
  contact_click: ["contact_id", "method", "placement", "locale"],
  job_apply_click: ["job_id", "placement", "locale"],
  generate_lead: ["form_name", "locale", "job_id"],
};
const datasetParameterKeys = {
  cta_click: {
    cta_id: "analyticsCtaId",
    placement: "analyticsPlacement",
    destination: "analyticsDestination",
    locale: "analyticsLocale",
  },
  contact_click: {
    contact_id: "analyticsContactId",
    method: "analyticsMethod",
    placement: "analyticsPlacement",
    locale: "analyticsLocale",
  },
  job_apply_click: {
    job_id: "analyticsJobId",
    placement: "analyticsPlacement",
    locale: "analyticsLocale",
  },
};

export function normalizeMeasurementId(value) {
  if (typeof value !== "string") return null;
  const measurementId = value.trim();
  return /^G-[A-Z0-9]+$/.test(measurementId) ? measurementId : null;
}

export function parseAnalyticsConsent(cookieHeader) {
  if (typeof cookieHeader !== "string") return null;

  const consentCookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`));
  if (!consentCookie) return null;

  const value = consentCookie.slice(ANALYTICS_CONSENT_COOKIE.length + 1);
  return consentValues.has(value) ? value : null;
}

export function serializeAnalyticsConsent(value, { secure = false } = {}) {
  if (!consentValues.has(value)) return null;

  return [
    `${ANALYTICS_CONSENT_COOKIE}=${value}`,
    `Max-Age=${ANALYTICS_CONSENT_MAX_AGE}`,
    "Path=/",
    "SameSite=Lax",
    secure ? "Secure" : null,
  ].filter(Boolean).join("; ");
}

export function normalizePagePath(pathname) {
  if (typeof pathname !== "string" || pathname.length === 0) return "/";
  const [path] = pathname.split(/[?#]/, 1);
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

function isEventValue(value) {
  return (typeof value === "string" && value.length > 0)
    || (typeof value === "number" && Number.isFinite(value))
    || typeof value === "boolean";
}

export function buildAnalyticsEvent(name, parameters = {}) {
  const allowedParameters = eventParameters[name];
  if (!allowedParameters || !parameters || typeof parameters !== "object") return null;

  const safeParameters = Object.fromEntries(
    allowedParameters
      .filter((parameter) => isEventValue(parameters[parameter]))
      .map((parameter) => [parameter, parameters[parameter]]),
  );

  return { name, parameters: safeParameters };
}

export function buildPageViewEvent({ pathname, origin, title, locale }) {
  const pagePath = normalizePagePath(pathname);
  const safeOrigin = typeof origin === "string" ? origin.replace(/\/$/, "") : "";

  return buildAnalyticsEvent("page_view", {
    page_path: pagePath,
    page_location: `${safeOrigin}${pagePath}`,
    page_title: title,
    locale,
  });
}

export function isNewPageView(previousPath, nextPath) {
  if (typeof previousPath !== "string") return true;
  return normalizePagePath(previousPath) !== normalizePagePath(nextPath);
}

export function dispatchAnalyticsEvent(gtag, event) {
  if (typeof gtag !== "function" || !event?.name || !event.parameters) return false;

  try {
    gtag("event", event.name, event.parameters);
    return true;
  } catch {
    return false;
  }
}

export function getDeclarativeClickEvent(dataset) {
  if (!dataset || typeof dataset !== "object") return null;
  const eventName = dataset.analyticsEvent;
  const keyMap = datasetParameterKeys[eventName];
  if (!keyMap) return null;

  const parameters = Object.fromEntries(
    Object.entries(keyMap).map(([parameter, datasetKey]) => [parameter, dataset[datasetKey]]),
  );
  return buildAnalyticsEvent(eventName, parameters);
}

export function getGaCookieDeletionStrings(cookieHeader, { hostname = "", secure = false } = {}) {
  if (typeof cookieHeader !== "string") return [];

  const cookieNames = [...new Set(
    cookieHeader
      .split(";")
      .map((part) => part.trim().split("=", 1)[0])
      .filter((name) => name === "_ga" || name.startsWith("_ga_")),
  )];
  const hostnameParts = hostname.split(".").filter(Boolean);
  const parentDomain = hostnameParts.length > 2
    ? `.${hostnameParts.slice(-2).join(".")}`
    : null;

  return cookieNames.flatMap((name) => {
    const domains = [null, hostname || null, parentDomain];
    return [...new Set(domains)].map((domain) => [
      `${name}=`,
      "Max-Age=0",
      "Path=/",
      "SameSite=Lax",
      domain ? `Domain=${domain}` : null,
      secure ? "Secure" : null,
    ].filter(Boolean).join("; "));
  });
}

let analyticsEnabled = false;

export function setAnalyticsEnabled(enabled) {
  analyticsEnabled = enabled === true;
}

export function trackAnalyticsEvent(name, parameters) {
  if (!analyticsEnabled || typeof window === "undefined") return false;
  return dispatchAnalyticsEvent(window.gtag, buildAnalyticsEvent(name, parameters));
}

// Props for declarative click tracking; the click handler in Analytics.jsx reads them.
export function ctaProps(id, placement, destination) {
  return {
    "data-analytics-event": "cta_click",
    "data-analytics-cta-id": id,
    "data-analytics-placement": placement,
    "data-analytics-destination": destination,
  };
}

export function contactProps(id, method, placement) {
  return {
    "data-analytics-event": "contact_click",
    "data-analytics-contact-id": id,
    "data-analytics-method": method,
    "data-analytics-placement": placement,
  };
}

export function jobApplyProps(jobId, placement) {
  return {
    "data-analytics-event": "job_apply_click",
    "data-analytics-job-id": jobId,
    "data-analytics-placement": placement,
  };
}