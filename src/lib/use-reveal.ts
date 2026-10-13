"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { INTRO_DONE_EVENT } from "@/components/IntroOverlay";

/**
 * True once the element has scrolled into view (after the intro, if one is playing), so an
 * animation plays once. Straight away for visitors who prefer reduced motion.
 */
export function useRevealOnce<T extends Element>(threshold = 0.4) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    const watch = () => io.observe(el);
    if (!site.intro || document.documentElement.dataset.intro === "done") watch();
    else window.addEventListener(INTRO_DONE_EVENT, watch, { once: true });
    return () => {
      window.removeEventListener(INTRO_DONE_EVENT, watch);
      io.disconnect();
    };
  }, [threshold]);

  return [ref, shown] as const;
}
