import { groundFigures, type Ground } from "@/data/ground";
import { impact, site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { Meter } from "./Meter";

const count = (n: number) => n.toLocaleString(site.locale);

/** One row of the figures: the label in the first column, everything else starting on the same left edge in the second. */
function Row({ i, label, children }: { i: number; label: string; children: React.ReactNode }) {
  return (
    <div className="ground-reveal grid grid-cols-[6.5rem_1fr] gap-x-6 border-b border-line py-5" style={{ ["--i" as string]: i }}>
      <dt className="eyebrow pt-1.5 leading-snug">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

/**
 * A ground's figures, four rows of one shape: what has been planted there against the year's goal, what the fifth has put
 * in, who it builds with, and the one sourced figure that says why a euro goes far here. All from `partners` and `impact`
 * in data/site.ts, so the panel and the charts at the bottom can never disagree.
 */
export function GroundFigures({ ground }: { ground: Ground }) {
  const { partner, invested, target } = groundFigures(ground);
  const unit = target.unit ? ` ${target.unit}` : "";
  return (
    <dl className="border-t border-line">
      <Row i={3} label={target.label}>
        <p className="display text-3xl leading-none tabular-nums lining-nums">
          {count(target.value)} <span className="text-lg text-muted">/ {count(target.goal)}</span>
          {unit}
        </p>
        <div className="mt-4">
          <Meter label={target.label} value={target.value} goal={target.goal} text={`${count(target.value)} of ${count(target.goal)}${unit}`} />
        </div>
      </Row>
      <Row i={4} label="Put in">
        <p className="display text-3xl leading-none tabular-nums lining-nums">{formatPrice(invested.cents)}</p>
      </Row>
      <Row i={5} label="With">
        <p className="font-serif text-xl leading-tight">{partner.name}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{partner.focus}</p>
        <p className="eyebrow mt-3">{partner.status}</p>
      </Row>
      <Row i={6} label="Why here">
        <p className="display text-3xl leading-none text-red lining-nums">{partner.leverage.figure}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{partner.leverage.text}</p>
        <a href={partner.leverage.source.url} target="_blank" rel="noopener noreferrer" className="eyebrow link-underline mt-3 inline-block leading-snug">
          Source: {partner.leverage.source.label}
        </a>
      </Row>
      {impact.placeholder && (
        <div className="ground-reveal pt-4" style={{ ["--i" as string]: 7 }}>
          <p className="eyebrow leading-snug">Placeholder figures until the first payment clears.</p>
        </div>
      )}
    </dl>
  );
}
