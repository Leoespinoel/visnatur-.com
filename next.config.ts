import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    /**
     * Hostinger's build machine reports 59 cores, so Next.js started 58 build workers and the machine ran out of
     * threads ("OS can't spawn worker thread", 2026-10-20). Two workers build this site comfortably.
     */
    cpus: 2,
  },
  /** The archive of closed editions is gone: every design now stays on sale. */
  async redirects() {
    return [
      /**
       * The site opens on Origins (Leo, 2026-10-22). Temporary (307), so browsers don't cache it and the homepage in
       * src/app/page.tsx comes back the moment this line goes.
       */
      { source: "/", destination: "/about", permanent: false },
      { source: "/archive", destination: "/shop/all", permanent: false },
      /** The journal piece on made to order became the one on Signature and drops (2026-10-20). */
      { source: "/stories/made-once-you-order-it", destination: "/stories/signature-and-collections", permanent: true },
      /** Drops are called collections (Leo, 2026-10-20). */
      { source: "/drops", destination: "/collections", permanent: true },
      { source: "/stories/signature-and-drops", destination: "/stories/signature-and-collections", permanent: true },
      // Shorts & Tees became two categories.
      { source: "/:section(shop|men|women)/shorts-tees", destination: "/:section/tees", permanent: false },
      /** Version A on /versions is this site from its shop homepage (Leo, 2026-10-29). */
      { source: "/a", destination: "/home", permanent: false },
    ];
  },
  /**
   * The partners & press page is a static file in public/; serve it at a clean URL. Versions B, C and D of the site are static
   * copies in public/b, public/c and public/d, the same way (Leo, 2026-10-29: "like you did for the pitch"): each page is
   * a .html file there, its scripts and payloads are plain files, so only the page addresses need mapping.
   */
  async rewrites() {
    return {
      afterFiles: [
        { source: "/pitch", destination: "/pitch.html" },
        { source: "/:version(b|c|d)", destination: "/:version/index.html" },
        { source: "/:version(b|c|d)/:path*", destination: "/:version/:path*.html" },
      ],
    };
  },
};

export default nextConfig;
