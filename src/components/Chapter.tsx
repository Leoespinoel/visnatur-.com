"use client";

import { useRevealOnce } from "@/lib/use-reveal";

/** The numeral and the chapter name share one size (Leo, 2026-10-20). */
const numeralSize = "text-[clamp(3rem,6vw,5rem)] leading-[0.95]";

/**
 * A chapter head on an editorial page (Origins): a rule across the page, then the chapter's number in red and its name beside
 * it, both at the same display size, and under them, optionally, the chapter's headline at the passage size. Rises into place the
 * first time it scrolls into view (`.rise`, globals.css). `numeralClassName` lets the red band set its numeral white.
 */
export function Chapter({
  numeral,
  eyebrow,
  title,
  as: Heading = "h2",
  numeralClassName = "text-red",
  className = "",
}: {
  /** The chapter's number; left off when a ChapterCover already carries it. */
  numeral?: string;
  /** The chapter's name; a node when it carries its own marks, like the headword on Origins. */
  eyebrow: React.ReactNode;
  title?: React.ReactNode;
  /** The page's first chapter is its h1. */
  as?: "h1" | "h2";
  numeralClassName?: string;
  className?: string;
}) {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className={`rise ${shown ? "is-shown" : ""} border-t border-line pt-5 md:pt-6 ${className}`}>
      <Heading className={`display text-balance ${numeralSize}`}>
        {numeral && (
          <>
            <span aria-hidden="true" className={`mr-[0.3em] ${numeralClassName}`}>
              {numeral}
            </span>
            <span className="sr-only">Chapter {numeral}: </span>
          </>
        )}
        {eyebrow}
      </Heading>
      {title && <p className="display mt-6 text-balance text-2xl md:mt-8 md:text-3xl">{title}</p>}
    </div>
  );
}
