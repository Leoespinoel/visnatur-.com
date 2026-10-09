import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  /** The partners & press page is a static file in public/; serve it at a clean URL. */
  async rewrites() {
    return { afterFiles: [{ source: "/pitch", destination: "/pitch.html" }] };
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
