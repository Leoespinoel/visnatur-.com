import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  /** The archive of closed editions is gone: every design now stays on sale. */
  async redirects() {
    return [
      { source: "/archive", destination: "/shop/all", permanent: false },
      /** The journal piece on made to order became the one on Signature and drops (2026-10-20). */
      { source: "/stories/made-once-you-order-it", destination: "/stories/signature-and-collections", permanent: true },
      /** Drops are called collections (Leo, 2026-10-20). */
      { source: "/drops", destination: "/collections", permanent: true },
      { source: "/stories/signature-and-drops", destination: "/stories/signature-and-collections", permanent: true },
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
