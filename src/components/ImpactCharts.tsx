"use client";

import { useState } from "react";
import { impact, site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { useRevealOnce } from "@/lib/use-reveal";
import { RollingNumber } from "./RollingNumber";

// The impact block on /conservation, after forceofnature.org.in/bon-voyage: four counters roll in, twelve months of money
// to the work rise as thin red columns, and each partner target draws its fill. One hue (red on the band's paper, black or
// white, so the charts follow the theme they sit in); text stays in ink.

const EASE = "ease-[cubic-bezier(0.2,0.7,0.1,1)]";
const count = (n: number) => n.toLocaleString(site.locale);
const tag = impact.placeholder ? " · placeholder" : "";

export function ImpactCharts() {
  const sentCents = impact.months.reduce((sum, m) => sum + m.cents, 0);
  const [coral, trees] = impact.targets;
  const counters = [
    { label: "Pieces made", value: count(impact.piecesMade), note: "Since launch" },
    { label: "Put in", value: formatPrice(sentCents), note: "Paid out to date" },
    { label: coral.label, value: count(coral.value), note: coral.partner },
    { label: trees.label, value: count(trees.value), note: trees.partner },
  ];

  return (
    <div>
      <ul className="grid grid-cols-2 gap-px border-y border-line bg-line lg:grid-cols-4">
        {counters.map((c, i) => (
          <li key={c.label} className="flex min-h-44 flex-col justify-between gap-6 bg-paper p-5 md:min-h-52 md:p-6">
            <p className="eyebrow leading-snug">{c.label}</p>
            <p className="display text-[2.5rem] leading-none lining-nums sm:text-5xl lg:text-6xl">
              <RollingNumber value={c.value} delay={i * 120} />
            </p>
            <p className="eyebrow leading-snug">
              {c.note}
              {tag}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-16 md:mt-24">
        <ChartHead title="Put in, by month." note={`Euros · last twelve months${tag}`} />
        <MonthlyColumns />
      </div>

      <div className="mt-16 md:mt-24">
        <ChartHead title="Where it went, by place." note={`Put in to date${tag}`} />
        <InvestedPie />
      </div>

      <div className="mt-16 md:mt-24">
        <ChartHead title="Where it should be by year end." note={`Targets by place${tag}`} />
        <Targets />
      </div>
    </div>
  );
}

function ChartHead({ title, note }: { title: string; note: string }) {
  return (
    <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <h3 className="display text-3xl md:text-4xl">{title}</h3>
      <p className="eyebrow">{note}</p>
    </div>
  );
}

/** A tick step of 1, 2 or 5 × 10ⁿ that splits `max` into at most four bands; an empty chart still gets a €1,000 scale. */
function tickStep(max: number) {
  const raw = Math.max(max, 400000) / 4;
  const pow = 10 ** Math.floor(Math.log10(raw));
  return [1, 2, 5, 10].map((m) => m * pow).find((s) => s >= raw)!;
}

function MonthlyColumns() {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const months = impact.months;
  const last = months.length - 1;
  const step = tickStep(Math.max(...months.map((m) => m.cents)));
  const top = Math.max(step, Math.ceil(Math.max(...months.map((m) => m.cents)) / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  // The latest month is labelled until another column is hovered or focused.
  const labelled = active ?? last;

  return (
    <div ref={ref}>
      <div className="relative h-[clamp(11rem,24vw,16rem)]">
        {ticks.map((t) => (
          <div key={t} className="absolute inset-x-0 border-t border-line" style={{ bottom: `${(t / top) * 100}%` }} aria-hidden="true">
            <span className="absolute left-0 -translate-y-1/2 bg-paper pr-2 text-[10px] tabular-nums text-muted">{formatPrice(t)}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 right-0 left-14 grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
          {months.map((m, i) => {
            const h = (m.cents / top) * 100;
            const on = i === labelled;
            return (
              <div
                key={m.month}
                tabIndex={0}
                role="img"
                aria-label={`${m.month}: ${formatPrice(m.cents)}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="relative flex h-full cursor-default items-end justify-center outline-none focus-visible:bg-ink/5"
              >
                <span
                  className={`block w-full max-w-6 origin-bottom transition-transform duration-[1400ms] motion-reduce:transition-none ${EASE}`}
                  style={{ height: `${h}%`, transform: `scaleY(${shown ? 1 : 0})`, transitionDelay: `${i * 60}ms` }}
                >
                  <span className={`block h-full rounded-t-[4px] transition-colors duration-200 ${on && active !== null ? "bg-red-2" : "bg-red"}`} />
                </span>
                <span
                  className={`pointer-events-none absolute text-[11px] whitespace-nowrap tabular-nums text-ink transition-opacity duration-300 ${
                    on && shown ? "opacity-100" : "opacity-0"
                  } ${i === 0 ? "left-0" : i === last ? "right-0" : "left-1/2 -translate-x-1/2"}`}
                  style={{ bottom: `calc(${h}% + 8px)`, transitionDelay: active === null && shown ? "1500ms" : "0ms" }}
                  aria-hidden="true"
                >
                  {m.month} · {formatPrice(m.cents)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="ml-14 grid gap-[2px] pt-3 text-center text-[10px] tracking-[0.12em] text-muted uppercase"
        style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {months.map((m) => (
          <span key={m.month}>
            <span className="md:hidden">{m.month[0]}</span>
            <span className="hidden md:inline">{m.month}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// One colour per partner, in the order of `partners`: red, white, grey. Red and grey sit close for red-blind readers,
// so every slice also has a labelled legend row and a gap either side.
const SLICE_COLORS = ["var(--red)", "var(--ink)", "var(--muted)"];
const R = 46;
const C = 2 * Math.PI * R;
const GAP = 1;

function InvestedPie() {
  const [ref, shown] = useRevealOnce<HTMLDivElement>(0.3);
  const [active, setActive] = useState<number | null>(null);
  const total = impact.invested.reduce((sum, p) => sum + p.cents, 0);
  const share = (cents: number) => `${total ? Math.round((cents / total) * 100) : 0}%`;
  // Only cut gaps between slices when there is more than one to cut.
  const gap = impact.invested.filter((p) => p.cents > 0).length > 1 ? GAP : 0;

  const arc = (cents: number) => (total ? (cents / total) * C : 0);
  const slices = impact.invested.map((p, i) => ({
    ...p,
    color: SLICE_COLORS[i],
    // Where the slice begins along the ring: the length of every slice before it.
    start: impact.invested.slice(0, i).reduce((sum, q) => sum + arc(q.cents), 0),
    len: Math.max(arc(p.cents) - gap, 0),
  }));
  const on = active === null ? null : slices[active];
  const hover = (i: number) => ({
    onMouseEnter: () => setActive(i),
    onMouseLeave: () => setActive(null),
  });

  return (
    <div ref={ref} className="grid items-center gap-10 md:grid-cols-12 md:gap-12">
      <div className="relative mx-auto aspect-square w-full max-w-72 md:col-span-5 md:max-w-80">
        <svg
          viewBox="0 0 120 120"
          className="h-full w-full -rotate-90"
          role="img"
          aria-label={`Put in by place: ${slices.map((s) => `${s.partner} ${formatPrice(s.cents)} (${share(s.cents)})`).join(", ")}`}
        >
          {/* Nothing has been sent yet: an empty ring rather than no chart. */}
          {total === 0 && <circle cx={60} cy={60} r={R} fill="none" stroke="var(--line)" strokeWidth={16} />}
          {slices.map((s, i) => (
            <g key={s.partner} {...hover(i)} className={`transition-opacity duration-200 ${active !== null && active !== i ? "opacity-35" : ""}`}>
              <circle
                cx={60}
                cy={60}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={16}
                strokeDasharray={`${shown ? s.len : 0} ${C}`}
                strokeDashoffset={-s.start}
                className={`transition-[stroke-dasharray] duration-[1400ms] motion-reduce:transition-none ${EASE}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              />
            </g>
          ))}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3 text-center" aria-hidden="true">
          <p className="eyebrow max-w-[9rem] leading-snug">{on ? on.partner : "Put in to date"}</p>
          <p className="display text-4xl leading-none tabular-nums lining-nums md:text-5xl">{formatPrice(on ? on.cents : total)}</p>
          <p className={`eyebrow transition-opacity duration-200 ${on ? "opacity-100" : "opacity-0"}`}>{on ? share(on.cents) : "0%"}</p>
        </div>
      </div>

      <ul className="border-t border-line md:col-span-6 md:col-start-7">
        {slices.map((s, i) => (
          <li
            key={s.partner}
            tabIndex={0}
            {...hover(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
            className={`grid cursor-default grid-cols-[auto_1fr_auto] items-center gap-x-4 border-b border-line py-5 outline-none transition-opacity duration-200 focus-visible:bg-ink/5 md:py-6 ${
              active !== null && active !== i ? "opacity-40" : ""
            }`}
          >
            <span className="h-2.5 w-2.5" style={{ background: s.color }} aria-hidden="true" />
            <span className="text-sm font-semibold tracking-[0.02em] text-ink uppercase">{s.partner}</span>
            <span className="text-sm tabular-nums text-ink-2">
              {formatPrice(s.cents)} <span className="text-muted">· {share(s.cents)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Targets() {
  const [ref, shown] = useRevealOnce<HTMLUListElement>(0.3);
  return (
    <ul ref={ref} className="border-t border-line">
      {impact.targets.map((t, i) => {
        const unit = t.unit ? ` ${t.unit}` : "";
        return (
          <li key={t.label} className="grid grid-cols-[1fr_auto] items-baseline gap-x-5 gap-y-4 border-b border-line py-5 md:py-6">
            <p className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
              <span className="text-sm font-semibold tracking-[0.02em] text-ink uppercase">{t.label}</span>
              <span className="eyebrow">{t.partner}</span>
            </p>
            <p className="text-sm tabular-nums text-ink-2">
              {count(t.value)} / {count(t.goal)}
              {unit}
            </p>
            <div
              className="relative col-span-2 h-0.5 bg-red/25"
              role="meter"
              aria-label={t.label}
              aria-valuemin={0}
              aria-valuemax={t.goal}
              aria-valuenow={t.value}
              aria-valuetext={`${count(t.value)} of ${count(t.goal)}${unit}`}
            >
              <span
                className={`absolute inset-0 origin-left bg-red transition-transform duration-[1400ms] motion-reduce:transition-none ${EASE}`}
                style={{ transform: `scaleX(${shown ? Math.min(t.value / t.goal, 1) : 0})`, transitionDelay: `${i * 120}ms` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
