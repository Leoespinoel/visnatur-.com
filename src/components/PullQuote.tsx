"use client";

import { useRef } from "react";
import { useFitLine } from "@/lib/use-fit-line";
import { useRevealOnce } from "@/lib/use-reveal";

/** The page's two display sizes: `xl` for a short line or the headword, `lg` for every headline and sentence-length quote. */
const sizes = { xl: "text-[clamp(2.75rem,9vw,8rem)] leading-[0.95]", lg: "text-[clamp(2.25rem,5vw,4.5rem)] leading-[1.05]" };

/**
 * One line of the copy lifted to giant serif size, left-aligned on the page grid like everything else. `stop` is the closing punctuation, set in red (leave it out on the red
 * band, where it would vanish). Rises into place the first time it scrolls into view (`.rise`, globals.css). With `fit`, the
 * quote is sized to run on one line across its full width from `md` up (use-fit-line.ts), in place of `size`.
 */
export function PullQuote({
  children,
  size = "xl",
  stop,
  balance = true,
  fit = false,
  className = "",
}: {
  children: React.ReactNode;
  size?: keyof typeof sizes;
  stop?: string;
  /** Off, the lines run the full measure like the paragraphs beside it, instead of being evened out (Leo, 2026-10-21). */
  balance?: boolean;
  /** One line across the full width from `md` up, sized to fit; wraps on phones. */
  fit?: boolean;
  className?: string;
}) {
  const [ref, shown] = useRevealOnce<HTMLParagraphElement>(0.3);
  const none = useRef<HTMLParagraphElement>(null);
  useFitLine(fit ? ref : none);
  return (
    <p ref={ref} className={`rise ${shown ? "is-shown" : ""} display ${balance && !fit ? "text-balance" : ""} text-ink ${sizes[size]} ${className}`}>
      <span className={`inline-block ${fit ? "md:whitespace-nowrap" : ""}`}>
        {children}
        {stop && <span className="text-red">{stop}</span>}
      </span>
    </p>
  );
}
