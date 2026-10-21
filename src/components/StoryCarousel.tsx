import { Carousel } from "./Carousel";
import { StoryTile } from "./StoryPair";
import type { Story } from "./StoryCopy";

/**
 * A heading and a line, then a carousel of tall story tiles (ralphlauren.com's "The World of…" row).
 * `pad` is the white above and below; the homepage passes a tighter one.
 */
export function StoryCarousel({ title, dek, stories, pad = "py-16 md:py-24" }: { title: string; dek?: string; stories: Story[]; pad?: string }) {
  return (
    <section className={pad}>
      <div className="container-x mb-8 md:mb-10">
        <h2 className="display text-4xl md:text-5xl">{title}</h2>
        {dek && <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">{dek}</p>}
      </div>
      <Carousel
        ariaLabel={title}
        arrows="sides"
        itemClassName="w-[80%] sm:w-[45%] md:w-[calc((100%-1rem)/3.2)] lg:w-[calc((100%-1.5rem)/4.2)]"
      >
        {/* Tall tiles carry a label, a title and a link only, as on ralphlauren.com. */}
        {stories.map((s) => (
          <StoryTile key={s.title} story={{ ...s, dek: undefined }} size="sm" sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 80vw" />
        ))}
      </Carousel>
    </section>
  );
}
