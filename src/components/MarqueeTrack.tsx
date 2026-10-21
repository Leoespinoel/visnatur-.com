"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { useMarqueeSpeed } from "@/lib/marquee";

/**
 * The sliding track of a band (`.marquee-track`, globals.css), paced at the site's one marquee speed (lib/marquee.ts). Put the
 * repeated items inside; `as` picks the element, and other attributes pass through.
 */
export function MarqueeTrack({ as: Tag = "div", className = "", children, ...rest }: { as?: "div" | "span" | "ul" | "p"; className?: string; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLDivElement & HTMLSpanElement & HTMLUListElement & HTMLParagraphElement>(null);
  useMarqueeSpeed(ref);
  return (
    <Tag ref={ref} className={`marquee-track ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
