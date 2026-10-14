import Image from "next/image";
import Link from "next/link";
import { StoryCopy, type Story } from "./StoryCopy";

/**
 * Full-bleed story image with its copy bottom-left (or centred), ralphlauren.com's banner slot.
 * The whole picture links to the first link. `hero` makes it taller with a bigger title.
 */
export function StoryBanner({ story, align = "left", hero = false, preload = false }: { story: Story; align?: "left" | "center"; hero?: boolean; preload?: boolean }) {
  return (
    <section
      aria-label={story.title}
      className={`relative w-full overflow-hidden bg-[#0a0a0a] text-white ${hero ? "aspect-[4/5] sm:aspect-[16/9] lg:aspect-[16/8]" : "aspect-[4/5] sm:aspect-[16/9] md:aspect-[16/7]"}`}
    >
      <Link href={story.links[0]?.href ?? "/shop"} aria-label={story.title} tabIndex={-1} className="group absolute inset-0">
        <Image src={story.image} alt={story.alt} fill unoptimized preload={preload} sizes="100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <StoryCopy {...story} align={align} size={hero ? "lg" : "md"} />
      </div>
    </section>
  );
}
