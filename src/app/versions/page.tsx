import type { Metadata } from "next";
import { versions } from "@/data/versions";
import { VersionTiles } from "@/components/VersionTiles";

const COUNT = ["One", "Two", "Three", "Four", "Five", "Six"];

export const metadata: Metadata = {
  title: "Which one do you prefer?",
  description: "Versions of the Vis Naturæ website, side by side.",
  robots: { index: false, follow: false },
};

/**
 * Every version of the site on one page, to send to people and ask which they prefer (Leo, 2026-10-29). Plain, without the
 * site's header, footer, music or intro (SiteChrome.tsx), in the default sans, so the page itself leans towards none of them.
 */
export default function VersionsPage() {
  return (
    <div className="container-x py-12 md:py-20">
      <p className="eyebrow">Vis Naturæ</p>
      <h1 className="mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">Which one do you prefer?</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">
        {COUNT[versions.length - 1] ?? versions.length} versions of the Vis Naturæ website. Open each one, have a look around, then tell us which you prefer.
      </p>
      <div className="mt-12 md:mt-16">
        <VersionTiles />
      </div>
      <p className="mt-16 text-sm text-muted md:mt-24">The letter is enough. Thank you for looking.</p>
    </div>
  );
}
