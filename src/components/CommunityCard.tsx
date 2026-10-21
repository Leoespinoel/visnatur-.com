import type { CommunityPost } from "@/data/community";
import { LoopVideo } from "./LoopVideo";
import { StoryCopy } from "./StoryCopy";

/**
 * One community tile, laid out like the collection tiles: a photo, or a muted clip that loops while it is on screen, with the
 * discipline in white bottom-left (and the handle above it, for real people). `className` sets its shape.
 */
export function CommunityCard({ post, className = "aspect-[4/5]" }: { post: CommunityPost; className?: string }) {
  const handle = post.handle ? `@${post.handle}` : undefined;
  const media = "absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]";

  return (
    <figure className={`group relative overflow-hidden bg-paper-2 text-white ${className}`}>
      {post.video ? (
        <LoopVideo src={post.video} poster={post.image} className={media} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt={handle ?? post.label} loading="lazy" className={media} />
      )}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5 xl:p-6">
        <StoryCopy eyebrow={handle} title={post.label} links={[]} size="xs" />
      </figcaption>
    </figure>
  );
}
