"use client";

import { useRevealOnce } from "@/lib/use-reveal";

/** A thin red bar that draws its fill once in view: `value` of `goal`, the same bar as the targets in ImpactCharts.tsx. */
export function Meter({ label, value, goal, text }: { label: string; value: number; goal: number; text: string }) {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.3);
  return (
    <div ref={ref} className="relative h-0.5 bg-red/25" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={goal} aria-valuenow={value} aria-valuetext={text}>
      <span
        className="absolute inset-0 origin-left bg-red transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.7,0.1,1)] motion-reduce:transition-none"
        style={{ transform: `scaleX(${shown ? Math.min(value / goal, 1) : 0})` }}
      />
    </div>
  );
}
