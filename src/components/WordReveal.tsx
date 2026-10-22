"use client";

import { Fragment } from "react";
import { useRevealOnce } from "@/lib/use-reveal";

/** Time between one word and the next: a sixty-word paragraph arrives in about a second. */
const STEP_MS = 18;

/**
 * Paragraphs that write themselves in, one word at a time (Leo, 2026-10-22: "one word at a time quickly, but elegantly"): each
 * word fades up out of a soft blur (`.word`, globals.css) a beat after the one before it, in one run through every paragraph,
 * the first time the passage scrolls into view. All there at once under reduced motion or without scripts.
 */
export function WordReveal({ paragraphs, className = "" }: { paragraphs: string[]; className?: string }) {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.15);
  const words = paragraphs.map((p) => p.split(" "));
  const starts = words.map((_, n) => words.slice(0, n).reduce((sum, w) => sum + w.length, 0));
  return (
    <div ref={ref} className={`${shown ? "is-shown" : ""} ${className}`}>
      {words.map((line, n) => (
        <p key={n}>
          {line.map((word, k) => (
            <Fragment key={k}>
              {k > 0 && " "}
              <span className="word" style={{ transitionDelay: `${(starts[n] + k) * STEP_MS}ms` }}>
                {word}
              </span>
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
