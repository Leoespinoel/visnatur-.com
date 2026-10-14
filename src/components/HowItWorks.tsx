import Image from "next/image";
import { leadTimeLabel } from "@/lib/format";
import { pledgePercentLabel } from "@/lib/pledge";

export function HowItWorks({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      n: "01",
      title: "You order",
      text: "Choose a design and your size. Nothing is made in advance, so nothing has been cut yet.",
      image: { src: "/images/campaign-atelier.jpg?v=2", alt: "Linen shirts in red, green and yellow on a rail in the workshop", position: "object-right" },
    },
    {
      n: "02",
      title: "We make it",
      text: `Your piece is cut and sewn by hand in a small workshop in Mauritius, in your size. Allow ${leadTimeLabel()} from the day you order.`,
      image: { src: "/film/atelier-poster.jpg", alt: "A seam being sewn on a workshop sewing machine", position: "object-center" },
    },
    {
      n: "03",
      title: "It arrives, and gives back",
      text: `${pledgePercentLabel()} of what you paid goes straight to conservation. We report on it every season.`,
      image: { src: "/images/numbered-label.jpg?v=2", alt: "Hands laying a red jumper into its box", position: "object-center" },
    },
  ];
  return (
    <ol className={`grid gap-10 md:grid-cols-3 ${compact ? "" : "md:gap-12"}`}>
      {steps.map((s) => (
        <li key={s.n}>
          <div className="image-frame aspect-[4/5]">
            <Image src={s.image.src} alt={s.image.alt} fill unoptimized sizes="(min-width: 768px) 33vw, 100vw" className={`object-cover ${s.image.position}`} />
          </div>
          <p className="mt-5 font-serif text-sm tracking-[0.2em] text-muted">{s.n}</p>
          <h3 className="mt-3 font-serif text-2xl md:text-3xl">{s.title}</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ink-2">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
