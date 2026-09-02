import path from "node:path";
import { getRedirects, getRewrites } from "./lib/routing/config.mjs";

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
    return getRedirects();
  },
  async rewrites() {
    return getRewrites();
  },
};

export default nextConfig;
