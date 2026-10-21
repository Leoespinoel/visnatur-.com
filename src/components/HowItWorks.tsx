import Image from "next/image";
import { site } from "@/data/site";
import { formatPrice, madeToOrderLabel } from "@/lib/format";

/** Made to order, the service (Leo, 2026-10-20): a Signature piece adjusted to fit, in three steps. */
export function HowItWorks({ compact = false }: { compact?: boolean }) {
  const steps = [
    {
      n: "01",
      title: "Choose your adjustments",
      text: `On any Signature piece, choose Made to order and set the sleeve, the length or the fit. ${formatPrice(site.delivery.madeToOrderSurchargeCents)} per piece.`,
      image: { src: "/images/atelier/hands.jpg", alt: "A tailor's hands checking the cuff of a pale-blue linen shirt on the workshop table", position: "object-center" },
    },
    {
      n: "02",
      title: "It is made for you",
      text: `The measurements are confirmed by email, then the piece is cut and sewn by hand in Mauritius. Allow ${madeToOrderLabel()} from the order.`,
      image: { src: "/images/atelier/cutting.jpg", alt: "A tailor cutting cream linen along a chalk line in the workshop", position: "object-center" },
    },
    {
      n: "03",
      title: "It arrives",
      text: "Pressed, folded into tissue and sent express from the island. Repaired for free, for life.",
      image: { src: "/images/atelier/press.jpg", alt: "A master tailor pressing a cricket jumper while an apprentice folds a linen shirt into tissue", position: "object-center" },
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
