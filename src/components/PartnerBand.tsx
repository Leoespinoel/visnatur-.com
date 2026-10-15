import { partners } from "@/data/site";
import { LeafIcon, NeedleIcon } from "./Icons";

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

/** A partner's placeholder emblem in its ring. */
export function PartnerMark({ mark }: { mark: keyof typeof marks }) {
  return <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-current">{marks[mark]}</span>;
}

function Logo({ partner }: { partner: Partner }) {
  if (partner.logo) {
    return <img src={partner.logo} alt={partner.name} className="h-10 w-auto max-w-48 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-12" />;
  }
  return (
    <span className="flex items-center gap-3 text-ink-2">
      <PartnerMark mark={partner.mark} />
      <span className="text-xs font-medium uppercase tracking-label whitespace-nowrap md:text-sm">{partner.name}</span>
    </span>
  );
}

/** Partner logos running edge to edge across the page, on the site's marquee. */
export function PartnerBand() {
  // The track slides by half its width, so each half must be wider than the widest screen: the three partners repeat four times per half.
  const half = Array.from({ length: 4 }, () => partners).flat();
  const items = [...half, ...half];
  return (
    <div className="overflow-hidden border-y border-line bg-paper">
      <ul className="marquee-track marquee-hover-pause py-7 md:py-9 [--marquee-duration:60s]" aria-label="Conservation partners">
        {items.map((p, i) => (
          <li key={i} className="flex shrink-0 items-center px-8 md:px-14" aria-hidden={i >= partners.length}>
            <Logo partner={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
