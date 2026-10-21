import { partners } from "@/data/site";
import { LeafIcon, NeedleIcon } from "./Icons";
import { MarqueeTrack } from "./MarqueeTrack";

type Partner = (typeof partners)[number];

const base = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

/** Placeholder emblems, one per remit, until each partner's own logo is in public/partners/ (plus one for the workshop, on /stories). */
const marks: Record<Partner["mark"] | "workshop", React.ReactNode> = {
  ocean: (
    <svg {...base} aria-hidden="true">
      <path d="M3 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 14c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
      <path d="M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
    </svg>
  ),
  forest: <LeafIcon width={22} height={22} />,
  coast: (
    <svg {...base} aria-hidden="true">
      <path d="M5 10.5A3.5 3.5 0 0 1 8 7a4 4 0 0 1 8 0 3.5 3.5 0 0 1 3 3.5 2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 10.5z" />
      <path d="M12 13v2.5c-2.5 0-4.5 2-5.5 5M12 15.5c2.5 0 4.5 2 5.5 5M12 15.5v5" />
      <path d="M3 18.5c2-1.2 4-1.2 6 0s4 1.2 6 0 4-1.2 6 0" />
    </svg>
  ),
  workshop: <NeedleIcon width={22} height={22} />,
};

/** A partner's placeholder emblem in its ring; `className` sets the ring's size (the band draws it larger than the rows on /stories). */
export function PartnerMark({ mark, className = "h-11 w-11" }: { mark: keyof typeof marks; className?: string }) {
  return <span className={`flex shrink-0 items-center justify-center rounded-full border border-current ${className}`}>{marks[mark]}</span>;
}

function Logo({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return <img src={partner.logo} alt={partner.name} className="h-12 w-auto max-w-56 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-16" />;
  }
  return (
    <span className="flex items-center gap-4 text-ink-2">
      <PartnerMark mark={partner.mark} className="h-12 w-12 md:h-14 md:w-14" />
      <span className="text-sm font-medium uppercase tracking-label whitespace-nowrap md:text-base">{partner.name}</span>
    </span>
  );
}

/**
 * Partner logos running edge to edge across the page, on the site's marquee. A tall band (Leo, 2026-10-21: "make the logo band
 * wider"): deeper padding, larger marks and names, and more room between them.
 */
export function PartnerBand() {
  // The track slides by half its width, so each half must be wider than the widest screen: the three partners repeat four times per half.
  const half = Array.from({ length: 4 }, () => partners).flat();
  const items = [...half, ...half];
  return (
    <div className="overflow-hidden border-y border-line bg-paper">
      <MarqueeTrack as="ul" className="marquee-hover-pause py-12 md:py-16" aria-label="Who we build with">
        {items.map((p, i) => (
          <li key={i} className="flex shrink-0 items-center px-10 md:px-20" aria-hidden={i >= partners.length}>
            <Logo partner={p} />
          </li>
        ))}
      </MarqueeTrack>
    </div>
  );
}
