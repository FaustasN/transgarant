import assert from "node:assert/strict";
import test from "node:test";
import config from "../next.config.mjs";
import { getLocalizedPath, getPagePath } from "../lib/routing/paths.mjs";

const routes = [
  ["services", ["paslaugos", "services", "uslugi", "uslugi", "dienstleistungen", "services"]],
  ["about", ["apie-mus", "about-us", "o-nas", "o-kompanii", "ueber-uns", "a-propos"]],
  ["careers", ["karjera", "careers", "kariera", "karera", "karriere", "carrieres"]],
  ["contact", ["kontaktai", "contact", "kontakt", "kontakty", "kontakt", "contact"]],
  ["quote", ["uzklausa", "request-a-quote", "zapytanie", "zapros", "angebot-anfragen", "demande-de-devis"]],
  ["privacy", ["privatumo-politika", "privacy-policy", "polityka-prywatnosci", "politika-konfidencialnosti", "datenschutz", "politique-de-confidentialite"]],
];
const locales = ["lt", "en", "pl", "ru", "de", "fr"];

for (const [internal, slugs] of routes) {
  const getPath = (locale) => getPagePath(internal, locale);

  test(`${internal} keeps its public URLs, aliases and internal rewrite targets`, async () => {
    const redirects = await config.redirects();
    const rewrites = await config.rewrites();
    for (const [index, locale] of locales.entries()) {
      const canonical = `/${locale}/${slugs[index]}`;
      assert.equal(getPath(locale), canonical);
      if (slugs[index] !== internal) {
        assert.deepEqual(redirects.find((rule) => rule.source === `/${locale}/${internal}`), {
          source: `/${locale}/${internal}`, destination: canonical, permanent: true,
        });
        assert.deepEqual(rewrites.find((rule) => rule.source === canonical), {
          source: canonical, destination: `/${locale}/${internal}`,
        });
      }
      if (locale !== "lt" && slugs[index] !== slugs[0]) {
        assert.deepEqual(redirects.find((rule) => rule.source === `/${locale}/${slugs[0]}`), {
          source: `/${locale}/${slugs[0]}`, destination: canonical, permanent: true,
        });
      }
      for (const [targetIndex, targetLocale] of locales.entries()) {
        assert.equal(getLocalizedPath(canonical, targetLocale), `/${targetLocale}/${slugs[targetIndex]}`);
      }
    }
    assert.equal(getPath(), `/lt/${slugs[0]}`);
    assert.equal(getPath("unknown"), `/lt/${slugs[0]}`);
  });
}

test("home and unrecognized paths retain locale replacement behavior", () => {
  assert.equal(getLocalizedPath("/en", "fr"), "/fr");
  assert.equal(getLocalizedPath("/", "lt"), "/lt");
  assert.equal(getLocalizedPath("/en/unknown/details", "de"), "/de/unknown/details");
  assert.equal(getLocalizedPath("/unknown/details", "pl"), "/pl/unknown/details");
});

test("routing does not emit self redirects or duplicate sources", async () => {
  const redirects = await config.redirects();
  const rewrites = await config.rewrites();
  assert.equal(new Set(redirects.map(({ source }) => source)).size, redirects.length);
  assert.equal(new Set(rewrites.map(({ source }) => source)).size, rewrites.length);
  for (const { source, destination } of [...redirects, ...rewrites]) {
    assert.notEqual(source, destination);
  }
});
