"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { INTRO_DONE_EVENT, IntroOverlay } from "./IntroOverlay";

/** The streetwear version of the site lives under /v2 with its own header, footer and bag. */
export const isV2Path = (pathname: string) => pathname === "/v2" || pathname.startsWith("/v2/");

/** The classic site's chrome (header, footer, bag, music): hidden on /v2 pages, which bring their own. */
export function ClassicOnly({ children }: { children: ReactNode }) {
  return isV2Path(usePathname()) ? null : children;
}

/**
 * The red-wipe intro, on a full load of a classic page only. A visit that starts on /v2 never plays it, and
 * marks it done so the reveal animations and the wordmark on classic pages don't wait for it; once it has
 * played it doesn't come back when the visitor returns from /v2.
 */
export function ClassicIntro() {
  const v2 = isV2Path(usePathname());
  const [eligible] = useState(!v2);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!eligible) {
      document.documentElement.dataset.intro = "done";
      return;
    }
    const onDone = () => setDone(true);
    window.addEventListener(INTRO_DONE_EVENT, onDone);
    return () => window.removeEventListener(INTRO_DONE_EVENT, onDone);
  }, [eligible]);

  return eligible && !done && !v2 ? <IntroOverlay /> : null;
}
