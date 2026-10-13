"use client";

import { useRevealOnce } from "@/lib/use-reveal";

// A figure whose digits roll into place like an odometer the first time it scrolls into view (after the intro, if one is playing).
// `delay` (ms) holds the whole figure back, so a row of figures can roll in one after another.
export function RollingNumber({ value, className = "", delay = 0 }: { value: string; className?: string; delay?: number }) {
  const [ref, rolled] = useRevealOnce<HTMLSpanElement>(0.4);

  let digit = 0;
  return (
    <span ref={ref} className={`inline-flex ${className}`}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" className="inline-flex items-start">
        {[...value].map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={i}>{ch}</span>;
          const d = Number(ch);
          const wait = delay + digit++ * 140;
          return (
            // The clip trims the empty strip above the figures, so rolling digits never cross what sits just above.
            <span key={i} className="inline-block h-[1em] overflow-hidden [clip-path:inset(0.14em_0_0_0)]">
              {/* Two runs of 0–9, so every digit spins at least one full turn before it lands. */}
              <span
                className="flex flex-col transition-transform duration-[1800ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] motion-reduce:transition-none"
                style={{ transform: `translateY(${rolled ? -(d + 10) : 0}em)`, transitionDelay: `${wait}ms` }}
              >
                {Array.from({ length: 20 }, (_, n) => (
                  <span key={n} className="h-[1em]">
                    {n % 10}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
