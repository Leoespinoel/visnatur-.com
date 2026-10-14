import Image from "next/image";
import Link from "next/link";
import { Carousel } from "../Carousel";

export type StoryCard = { eyebrow?: string; title: string; href: string; image: string; alt: string };

const TONES = { dark: "theme-dark", grey: "bg-surface", red: "theme-red" } as const;

/**
 * "The Stories" band on ralphlauren.com/men: a large feature picture on the left, the band's title,
 * one line and a row of cards on the right, every card titled over its picture.
 */
export function StoryBand({
  title,
  text,
  feature,
  cards,
  tone,
}: {
  title: string;
  text: string;
  feature: StoryCard;
  cards: StoryCard[];
  tone: keyof typeof TONES;
}) {
  return (
    <section className={`${TONES[tone]} py-16 md:py-24`}>
      <div className="container-x grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
        <div className="md:col-span-7 md:col-start-6 md:row-start-1 md:self-start">
          <h2 className="display text-4xl md:text-6xl">{title}</h2>
          <p className="mt-3 max-w-sm font-serif text-lg leading-snug text-ink-2 md:mt-4">{text}</p>
        </div>
        <div className="md:col-span-5 md:row-span-2 md:row-start-1">
          <Card card={feature} large />
        </div>
        <div className="min-w-0 md:col-span-7 md:col-start-6 md:row-start-2">
          <Carousel ariaLabel={title} itemClassName="w-[78%] sm:w-[46%] md:w-[calc(50%-4px)]" gap="gap-1.5 md:gap-2" arrows="sides">
            {cards.map((c) => (
              <Card key={c.href + c.title} card={c} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}

function Card({ card, large = false }: { card: StoryCard; large?: boolean }) {
  return (
    <Link href={card.href} className="group relative block aspect-[3/4] overflow-hidden bg-paper-2 text-white">
      <Image
        src={card.image}
        alt={card.alt}
        fill
        unoptimized
        sizes={large ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 768px) 28vw, 78vw"}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        {card.eyebrow && <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/85 md:text-[11px]">{card.eyebrow}</p>}
        <p className={`display mt-2 ${large ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>{card.title}</p>
      </div>
    </Link>
  );
}
