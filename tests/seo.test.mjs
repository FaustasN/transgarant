import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { createPageMetadata } from "../lib/seo/metadata.mjs";
import { createBreadcrumbs, serializeStructuredData } from "../lib/seo/structuredData.mjs";

const content = {
  meta: { title: "Page title", description: "Page description" },
  hero: {
    title: "Hero title", titlePrimary: "Your cargo.", titleSecondary: "Our responsibility.",
    description: "Hero description", imageAlt: "Image description",
    breadcrumbHome: "Home", breadcrumbCurrent: "Current page",
  },
};

test("page structured-data imports resolve to the component on case-insensitive filesystems", async () => {
  const files = await readdir(new URL("../lib/seo/", import.meta.url));
  for (const page of ["about/AboutPage", "careers/CareersPage", "contact/ContactPage", "quote/QuotePage", "services/ServicesPage"]) {
    const source = await readFile(new URL(`../features/${page}.jsx`, import.meta.url), "utf8");
    const specifier = source.match(/import StructuredData from "@\/lib\/seo\/([^"]+)"/);
    assert.ok(specifier, `${page} imports the structured-data component`);
    // Next's webpack resolver tries .mjs before .jsx; Windows ignores casing.
    const resolved = ["", ".js", ".mjs", ".tsx", ".ts", ".jsx", ".json"]
      .map((extension) => files.find((file) => file.toLowerCase() === `${specifier[1]}${extension}`.toLowerCase()))
      .find(Boolean);
    assert.equal(resolved, "StructuredData.jsx", `${page} must resolve to the component, not the helper`);
  }
});

test("metadata retains canonical and language links for localized pages", () => {
  const metadata = createPageMetadata("quote", "de", content);
  assert.equal(metadata.title, "Page title");
  assert.equal(metadata.description, "Page description");
  assert.deepEqual(metadata.alternates, {
    canonical: "https://www.transgarant.lt/de/angebot-anfragen",
    languages: {
      lt: "https://www.transgarant.lt/lt/uzklausa",
      en: "https://www.transgarant.lt/en/request-a-quote",
      pl: "https://www.transgarant.lt/pl/zapytanie",
      ru: "https://www.transgarant.lt/ru/zapros",
      de: "https://www.transgarant.lt/de/angebot-anfragen",
      fr: "https://www.transgarant.lt/fr/demande-de-devis",
    },
  });
  assert.deepEqual(metadata.openGraph, {
    title: "Page title", description: "Page description",
    url: "https://www.transgarant.lt/de/angebot-anfragen",
    siteName: "TRANSGARANT GROUP", locale: "de_DE", type: "website",
  });
  assert.deepEqual(createPageMetadata("about", "unknown", undefined), {});
});

test("home keeps its composed title and undimensioned hero image", () => {
  const metadata = createPageMetadata("home", "en", content);
  assert.equal(metadata.title, "Your cargo. Our responsibility. | TRANSGARANT GROUP");
  assert.equal(metadata.description, "Hero description");
  assert.equal(metadata.alternates.canonical, "https://www.transgarant.lt/en");
  assert.deepEqual(metadata.openGraph.images, [{
    url: "https://www.transgarant.lt/heroImage.webp", alt: "Image description",
  }]);
});

test("each image-bearing page retains its own image dimensions and alt source", () => {
  for (const [page, expected] of [
    ["about", { url: "https://www.transgarant.lt/4.webp", width: 1600, height: 900, alt: "Image description" }],
    ["careers", { url: "https://www.transgarant.lt/career.webp", width: 1165, height: 594, alt: "Image description" }],
    ["services", { url: "https://www.transgarant.lt/heroImage.webp", width: 1600, height: 900, alt: "Hero title" }],
  ]) {
    assert.deepEqual(createPageMetadata(page, "lt", content).openGraph.images, [expected]);
  }
});

test("breadcrumbs use public URLs and localized labels", () => {
  assert.deepEqual(createBreadcrumbs("about", "en", content.hero), {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.transgarant.lt/en" },
      { "@type": "ListItem", position: 2, name: "Current page", item: "https://www.transgarant.lt/en/about-us" },
    ],
  });
});

test("JSON-LD cannot close its script element through text content", () => {
  const data = { text: '</script><script>alert("x")</script>' };
  const serialized = serializeStructuredData(data);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), data);
});
