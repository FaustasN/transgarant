import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ANALYTICS_CONSENT_MAX_AGE,
  buildAnalyticsEvent,
  buildPageViewEvent,
  dispatchAnalyticsEvent,
  getDeclarativeClickEvent,
  getGaCookieDeletionStrings,
  isNewPageView,
  normalizeMeasurementId,
  parseAnalyticsConsent,
  serializeAnalyticsConsent,
} from "../lib/analytics/core.mjs";

test("measurement IDs accept trimmed GA4 IDs and reject unavailable or malformed values", () => {
  assert.equal(normalizeMeasurementId("  G-ABC123  "), "G-ABC123");
  for (const value of [undefined, null, "", "   ", "UA-123", "g-abc123", "G-ABC_123"]) {
    assert.equal(normalizeMeasurementId(value), null);
  }
});

test("analytics consent reads only explicit granted and denied cookie values", () => {
  assert.equal(parseAnalyticsConsent("theme=dark; analytics_consent=granted; locale=en"), "granted");
  assert.equal(parseAnalyticsConsent("analytics_consent=denied"), "denied");
  assert.equal(parseAnalyticsConsent("analytics_consent=maybe"), null);
  assert.equal(parseAnalyticsConsent("other=value"), null);
  assert.equal(parseAnalyticsConsent(undefined), null);
});

test("analytics consent serializes a six-month first-party cookie with HTTPS protection", () => {
  assert.equal(ANALYTICS_CONSENT_MAX_AGE, 15_552_000);
  assert.equal(
    serializeAnalyticsConsent("granted", { secure: true }),
    "analytics_consent=granted; Max-Age=15552000; Path=/; SameSite=Lax; Secure",
  );
  assert.equal(
    serializeAnalyticsConsent("denied", { secure: false }),
    "analytics_consent=denied; Max-Age=15552000; Path=/; SameSite=Lax",
  );
  assert.equal(serializeAnalyticsConsent("maybe", { secure: true }), null);
});

test("business events retain only their stable non-PII parameters", () => {
  assert.deepEqual(
    buildAnalyticsEvent("cta_click", {
      cta_id: "hero_quote",
      placement: "home_hero",
      destination: "/en/request-a-quote",
      locale: "en",
      email: "visitor@example.com",
      phone: "+37060000000",
      ignored: "secret",
    }),
    {
      name: "cta_click",
      parameters: {
        cta_id: "hero_quote",
        placement: "home_hero",
        destination: "/en/request-a-quote",
        locale: "en",
      },
    },
  );

  assert.deepEqual(
    buildAnalyticsEvent("generate_lead", {
      form_name: "career",
      locale: "lt",
      job_id: "driver",
      name: "Private Person",
      message: "Private message",
    }),
    {
      name: "generate_lead",
      parameters: { form_name: "career", locale: "lt", job_id: "driver" },
    },
  );
  assert.equal(buildAnalyticsEvent("unknown_event", { locale: "en" }), null);
});

test("page views exclude query strings and hashes and deduplicate the normalized pathname", () => {
  assert.deepEqual(
    buildPageViewEvent({
      pathname: "/en/contact?campaign=private#form",
      origin: "https://www.transgarant.lt",
      title: "Contact | TRANSGARANT GROUP",
      locale: "en",
    }),
    {
      name: "page_view",
      parameters: {
        page_path: "/en/contact",
        page_location: "https://www.transgarant.lt/en/contact",
        page_title: "Contact | TRANSGARANT GROUP",
        locale: "en",
      },
    },
  );
  assert.equal(isNewPageView(null, "/"), true);
  assert.equal(isNewPageView("/en/contact", "/en/contact?again=1#form"), false);
  assert.equal(isNewPageView("/en/contact", "/en/about-us"), true);
});

test("analytics dispatch safely handles unavailable and throwing tag functions", () => {
  const event = buildAnalyticsEvent("contact_click", {
    contact_id: "office_phone",
    method: "phone",
    placement: "contact_page",
    locale: "en",
  });
  assert.equal(dispatchAnalyticsEvent(undefined, event), false);
  assert.equal(dispatchAnalyticsEvent(() => { throw new Error("blocked"); }, event), false);

  const calls = [];
  assert.equal(dispatchAnalyticsEvent((...args) => calls.push(args), event), true);
  assert.deepEqual(calls, [["event", "contact_click", event.parameters]]);
  assert.equal(dispatchAnalyticsEvent((...args) => calls.push(args), null), false);
});

test("declarative click metadata maps only supported fields into a business event", () => {
  assert.deepEqual(
    getDeclarativeClickEvent({
      analyticsEvent: "cta_click",
      analyticsCtaId: "hero_quote",
      analyticsPlacement: "home_hero",
      analyticsDestination: "/en/request-a-quote",
      analyticsLocale: "en",
      analyticsEmail: "visitor@example.com",
    }),
    {
      name: "cta_click",
      parameters: {
        cta_id: "hero_quote",
        placement: "home_hero",
        destination: "/en/request-a-quote",
        locale: "en",
      },
    },
  );
  assert.equal(getDeclarativeClickEvent({ analyticsEvent: "menu_open" }), null);
});

test("GA cookie cleanup covers the host and parent domain without touching other cookies", () => {
  assert.deepEqual(
    getGaCookieDeletionStrings("theme=dark; _ga=one; _ga_ABC=two", {
      hostname: "www.transgarant.lt",
      secure: true,
    }),
    [
      "_ga=; Max-Age=0; Path=/; SameSite=Lax; Secure",
      "_ga=; Max-Age=0; Path=/; SameSite=Lax; Domain=www.transgarant.lt; Secure",
      "_ga=; Max-Age=0; Path=/; SameSite=Lax; Domain=.transgarant.lt; Secure",
      "_ga_ABC=; Max-Age=0; Path=/; SameSite=Lax; Secure",
      "_ga_ABC=; Max-Age=0; Path=/; SameSite=Lax; Domain=www.transgarant.lt; Secure",
      "_ga_ABC=; Max-Age=0; Path=/; SameSite=Lax; Domain=.transgarant.lt; Secure",
    ],
  );
});

test("every supported locale provides the complete analytics consent interface", async () => {
  for (const locale of ["lt", "en", "pl", "ru", "de", "fr"]) {
    const source = await readFile(new URL(`../locales/${locale}/common.json`, import.meta.url), "utf8");
    const consent = JSON.parse(source).analyticsConsent;
    assert.deepEqual(Object.keys(consent).sort(), ["accept", "decline", "description", "title"]);
    for (const value of Object.values(consent)) {
      assert.equal(typeof value, "string");
      assert.ok(value.trim().length > 0);
    }
  }
});
