import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import test from "node:test";

// Next.js treats these .js metadata routes as ES modules; match that in Node.
const metadataModules = ["robots", "sitemap"].map((name) => new URL(`../app/${name}.js`, import.meta.url).href);
registerHooks({
  load(url, context, nextLoad) {
    return nextLoad(url, metadataModules.includes(url) ? { ...context, format: "module" } : context);
  },
});
const { default: robots } = await import("../app/robots.js");
const { default: sitemap } = await import("../app/sitemap.js");

const origin = "https://www.transgarant.lt";
const localizedSlugs = {
  lt: ["", "paslaugos", "apie-mus", "karjera", "kontaktai", "uzklausa"],
  en: ["", "services", "about-us", "careers", "contact", "request-a-quote"],
  pl: ["", "uslugi", "o-nas", "kariera", "kontakt", "zapytanie"],
  ru: ["", "uslugi", "o-kompanii", "karera", "kontakty", "zapros"],
  de: ["", "dienstleistungen", "ueber-uns", "karriere", "kontakt", "angebot-anfragen"],
  fr: ["", "services", "a-propos", "carrieres", "contact", "demande-de-devis"],
};

test("sitemap lists each canonical public page once, without redirect aliases or APIs", () => {
  const urls = sitemap().map(({ url }) => url);
  const expected = Object.entries(localizedSlugs).flatMap(([locale, slugs]) =>
    slugs.map((slug) => `${origin}/${locale}${slug ? `/${slug}` : ""}`),
  );
  assert.equal(urls.length, 36);
  assert.equal(new Set(urls).size, 36);
  assert.deepEqual(urls.sort(), expected.sort());
});

test("every sitemap entry links the same page in all six languages, including itself", () => {
  const entries = sitemap();
  for (const [locale, slugs] of Object.entries(localizedSlugs)) {
    for (const [pageIndex, slug] of slugs.entries()) {
      const url = `${origin}/${locale}${slug ? `/${slug}` : ""}`;
      const entry = entries.find((item) => item.url === url);
      const expected = Object.fromEntries(Object.entries(localizedSlugs).map(([language, pages]) => [
        language, `${origin}/${language}${pages[pageIndex] ? `/${pages[pageIndex]}` : ""}`,
      ]));
      assert.deepEqual(entry.alternates.languages, expected);
    }
  }
});

test("robots permits public crawling, excludes APIs and advertises the canonical sitemap", () => {
  assert.deepEqual(robots(), {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://www.transgarant.lt/sitemap.xml",
  });
});

test("llms overview links only to canonical pages or the generated sitemap", async () => {
  const overview = await readFile(new URL("../public/llms.txt", import.meta.url), "utf8");
  const links = [...overview.matchAll(/\[[^\]]+\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  const publicUrls = new Set(sitemap().map(({ url }) => url));
  publicUrls.add(`${origin}/sitemap.xml`);
  assert.ok(links.length >= 6);
  for (const link of links) assert.ok(publicUrls.has(link), `Noncanonical link: ${link}`);
});
