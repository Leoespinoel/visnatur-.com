import { leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

export function HowItWorks({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      n: "01",
      title: "You order",
      text: "Choose a design and your size. Nothing is made in advance, so nothing has been cut yet.",
    },
    {
      n: "02",
      title: "We make it",
      text: `Your piece is cut and sewn by hand in a small workshop in Mauritius, in your size. Allow ${leadTimeLabel()} from the day you order.`,
    },
    {
      n: "03",
      title: "It arrives, and gives back",
      text: `${pledgePercentLabel()} of what you paid goes straight to conservation. We report on it every season.`,
    },
  ];
  return (
    <ol className={`grid gap-10 md:grid-cols-3 ${compact ? "" : "md:gap-12"}`}>
      {steps.map((s) => (
        <li key={s.n} className="border-t border-ink pt-5">
          <p className="font-serif text-sm tracking-[0.2em] text-muted">{s.n}</p>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl">{s.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
