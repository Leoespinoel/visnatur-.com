"use client";

import { useRef, useState } from "react";
import type { CommunityPost } from "@/data/community";

/** One tall community card: a photo, or a clip that plays (muted, looping) when clicked. */
export function CommunityCard({ post }: { post: CommunityPost }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const caption = post.handle ? `@${post.handle}` : post.label;

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <figure className="relative">
      <div className="image-frame aspect-[4/5]">
        {post.video ? (
          <>
            <video
              ref={ref}
              src={post.video}
              poster={post.image}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 h-full w-full object-cover"
              aria-label={caption}
            />
            <button
              type="button"
              onClick={toggle}
              aria-label={playing ? "Pause video" : "Play video"}
              className="absolute inset-0 flex items-center justify-center"
            >
              {!playing && (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/85 text-ink backdrop-blur transition-transform hover:scale-105">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              )}
            </button>
          </>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.image} alt={caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
      </div>
      <figcaption className="mt-2 px-2 text-[12px] font-medium tracking-[0.02em] text-ink">{caption}</figcaption>
    </figure>
  );
}
