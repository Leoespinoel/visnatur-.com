import type { ReactNode } from "react";

/** A section's label and heading on the left, a line of copy on the right (as on /stories). */
export function BandHeading({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between md:gap-12">
      <div>
        <p className="eyebrow mb-3">{eyebrow}</p>
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
      </div>
      {children && <div className="max-w-md text-sm leading-relaxed text-ink-2">{children}</div>}
    </div>
  );
}
