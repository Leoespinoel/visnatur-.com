"use client";

import { useRef, type ReactNode } from "react";
import { useFitLine } from "@/lib/use-fit-line";

/** A heading or line sized to run on exactly one line across its full width from `md` up (use-fit-line.ts); it wraps on phones. */
export function FitLine({ as: Tag = "p", className = "", children }: { as?: "h2" | "h3" | "p"; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLHeadingElement & HTMLParagraphElement>(null);
  useFitLine(ref);
  return (
    <Tag ref={ref} className={className}>
      <span className="inline-block md:whitespace-nowrap">{children}</span>
    </Tag>
  );
}
