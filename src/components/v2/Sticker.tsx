import type { CSSProperties, ReactNode } from "react";

/** A rotated sticker with a hard shadow. */
export function Sticker({
  children,
  tone = "white",
  round = false,
  tilt = -4,
  className = "",
}: {
  children: ReactNode;
  tone?: "white" | "red" | "black";
  round?: boolean;
  tilt?: number;
  className?: string;
}) {
  const toneClass = { white: "", red: "v2-sticker-red", black: "v2-sticker-black" }[tone];
  return (
    <span className={`v2-sticker ${toneClass} ${round ? "v2-sticker-round" : ""} ${className}`} style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
      {children}
    </span>
  );
}

/** Masking tape across a picture, for pieces that can't be ordered yet. */
export function Tape({ children = "Coming soon", tilt = -3, className = "" }: { children?: ReactNode; tilt?: number; className?: string }) {
  return (
    <span className={`v2-tape ${className}`} style={{ "--tilt": `${tilt}deg` } as CSSProperties}>
      {children}
    </span>
  );
}
