"use client";

import type { ReactNode } from "react";
import { useRevealOnce } from "@/lib/use-reveal";

/**
 * One panel of the descent: at least a screen under the header, snapping to its start (`.ground-panel`, globals.css).
 * `altitude` and `stage` are read by GroundScene from the DOM as the page scrolls; `data-shown` goes on once the panel is
 * in view, and the copy marked `.ground-reveal` / `.ground-sweep` inside it rises in. The summit and the grounds centre
 * their copy in the screen (`align="center"`); the long panels at the bottom read from the top (`"start"`).
 */
export function GroundPanel({
  id,
  altitude,
  stage,
  align = "end",
  label,
  className = "",
  children,
}: {
  id: string;
  altitude: number;
  stage: number;
  align?: "start" | "center" | "end";
  label?: string;
  className?: string;
  children: ReactNode;
}) {
  const [ref, shown] = useRevealOnce<HTMLElement>(0.2);
  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      data-ground-panel=""
      data-altitude={altitude}
      data-stage={stage}
      data-shown={shown ? "" : undefined}
      className={`ground-panel relative flex flex-col ${align === "end" ? "justify-end" : align === "center" ? "justify-center" : "justify-start"} ${className}`}
    >
      {children}
    </section>
  );
}
