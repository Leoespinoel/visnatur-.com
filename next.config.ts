import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  /** The archive of closed editions is gone: every design now stays on sale. */
  async redirects() {
    return [
      { source: "/archive", destination: "/shop/all", permanent: false },
      // Shorts & Tees became two categories.
      { source: "/:section(shop|men|women)/shorts-tees", destination: "/:section/tees", permanent: false },
    ];
  },
  /** The partners & press page is a static file in public/; serve it at a clean URL. */
  async rewrites() {
    return { afterFiles: [{ source: "/pitch", destination: "/pitch.html" }] };
  },
};

export default nextConfig;
