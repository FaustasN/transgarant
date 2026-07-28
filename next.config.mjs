import path from "node:path";
import {
  aboutSlugs,
  careersSlugs,
  contactSlugs,
  quoteSlugs,
  servicesSlugs,
} from "./lib/routes.mjs";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  turbopack: {
    root: path.resolve("."),
  },
  async redirects() {
    return [
      ...Object.entries(servicesSlugs)
        .filter(([, slug]) => slug !== "services")
        .map(([locale, slug]) => ({
          source: `/${locale}/services`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(servicesSlugs)
        .filter(([locale, slug]) => locale !== "lt" && slug !== "paslaugos")
        .map(([locale, slug]) => ({
          source: `/${locale}/paslaugos`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(aboutSlugs)
        .filter(([, slug]) => slug !== "about")
        .map(([locale, slug]) => ({
          source: `/${locale}/about`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(aboutSlugs)
        .filter(([locale, slug]) => locale !== "lt" && slug !== "apie-mus")
        .map(([locale, slug]) => ({
          source: `/${locale}/apie-mus`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(careersSlugs)
        .filter(([, slug]) => slug !== "careers")
        .map(([locale, slug]) => ({
          source: `/${locale}/careers`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(careersSlugs)
        .filter(([locale, slug]) => locale !== "lt" && slug !== "karjera")
        .map(([locale, slug]) => ({
          source: `/${locale}/karjera`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(contactSlugs)
        .filter(([, slug]) => slug !== "contact")
        .map(([locale, slug]) => ({
          source: `/${locale}/contact`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(contactSlugs)
        .filter(([locale, slug]) => locale !== "lt" && slug !== "kontaktai")
        .map(([locale, slug]) => ({
          source: `/${locale}/kontaktai`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(quoteSlugs)
        .filter(([, slug]) => slug !== "quote")
        .map(([locale, slug]) => ({
          source: `/${locale}/quote`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
      ...Object.entries(quoteSlugs)
        .filter(([locale, slug]) => locale !== "lt" && slug !== "uzklausa")
        .map(([locale, slug]) => ({
          source: `/${locale}/uzklausa`,
          destination: `/${locale}/${slug}`,
          permanent: true,
        })),
    ];
  },
  async rewrites() {
    return [
      ...Object.entries(servicesSlugs)
        .filter(([, slug]) => slug !== "services")
        .map(([locale, slug]) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}/services`,
        })),
      ...Object.entries(aboutSlugs)
        .filter(([, slug]) => slug !== "about")
        .map(([locale, slug]) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}/about`,
        })),
      ...Object.entries(careersSlugs)
        .filter(([, slug]) => slug !== "careers")
        .map(([locale, slug]) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}/careers`,
        })),
      ...Object.entries(contactSlugs)
        .filter(([, slug]) => slug !== "contact")
        .map(([locale, slug]) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}/contact`,
        })),
      ...Object.entries(quoteSlugs)
        .filter(([, slug]) => slug !== "quote")
        .map(([locale, slug]) => ({
          source: `/${locale}/${slug}`,
          destination: `/${locale}/quote`,
        })),
    ];
  },
};

export default nextConfig;
