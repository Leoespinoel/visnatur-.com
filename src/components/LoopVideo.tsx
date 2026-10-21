"use client";

import { useEffect, useRef } from "react";

/** A muted loop that only loads and plays while it is on screen, and stays on its poster for reduced motion. */
export function LoopVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          video.play().catch(() => undefined);
        } else video.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  return <video ref={ref} poster={poster} muted loop playsInline preload="none" aria-hidden="true" className={className} />;
}
