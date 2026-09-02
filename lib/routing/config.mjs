import { pageSlugs } from "./paths.mjs";

export function getRedirects() {
  return Object.entries(pageSlugs).flatMap(([page, slugs]) => [
    ...Object.entries(slugs)
      .filter(([, slug]) => slug !== page)
      .map(([locale, slug]) => ({
        source: `/${locale}/${page}`,
        destination: `/${locale}/${slug}`,
        permanent: true,
      })),
    ...Object.entries(slugs)
      .filter(([locale, slug]) => locale !== "lt" && slug !== slugs.lt)
      .map(([locale, slug]) => ({
        source: `/${locale}/${slugs.lt}`,
        destination: `/${locale}/${slug}`,
        permanent: true,
      })),
  ]);
}

export function getRewrites() {
  return Object.entries(pageSlugs).flatMap(([page, slugs]) =>
    Object.entries(slugs)
      .filter(([, slug]) => slug !== page)
      .map(([locale, slug]) => ({
        source: `/${locale}/${slug}`,
        destination: `/${locale}/${page}`,
      })),
  );
}
