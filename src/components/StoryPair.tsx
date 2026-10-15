import Image from "next/image";
import Link from "next/link";
import { comingSoon } from "@/data/availability";
import { StoryCopy, type Story } from "./StoryCopy";
import { ComingSoon } from "./ComingSoon";

/** One story on a picture, copy bottom-left; the picture links to the story's first link. */
export function StoryTile({
  story,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  size = "md",
}: {
  story: Story;
  aspect?: string;
  sizes?: string;
  size?: "sm" | "md";
}) {
  return (
    <article className={`relative overflow-hidden bg-paper-2 text-white ${aspect}`}>
      <Link href={story.links[0]?.href ?? "/shop"} aria-label={story.title} tabIndex={-1} className="group absolute inset-0">
        <Image src={story.image} alt={story.alt} fill unoptimized sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      {story.links[0] && comingSoon(story.links[0].href) && <ComingSoon />}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8">
        <StoryCopy {...story} size={size} />
      </div>
    </article>
  );
}

/** Two stories side by side, ralphlauren.com's 50/50 slot; stacked on phones. */
export function StoryPair({ stories }: { stories: [Story, Story] }) {
  return (
    <section className="grid gap-1.5 md:grid-cols-2 md:gap-2">
      {stories.map((s) => (
        <StoryTile key={s.title} story={s} />
      ))}
    </section>
  );
}
