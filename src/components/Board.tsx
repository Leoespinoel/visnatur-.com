import Image from "next/image";
import type { ReactNode } from "react";

/**
 * The furniture of the Origins mood board (`.theme-cork`, globals.css): push-pins, masking tape, sheets of paper and
 * single Polaroids. All still, all server-rendered; the collage deals its own cards with these same parts.
 */

/** A push-pin: a small domed head with a highlight, at `x` across its paper's top edge. Red on paper, brass on the red card. */
export function Pin({ x = 50, tone = "red" }: { x?: number; tone?: "red" | "brass" }) {
  const head =
    tone === "red"
      ? "bg-[radial-gradient(circle_at_35%_30%,#ff7a8a,#c8102e_55%,#8e0a20)]"
      : "bg-[radial-gradient(circle_at_35%_30%,#f3dca0,#c9a45c_55%,#7a5a22)]";
  return <span aria-hidden="true" className={`absolute -top-2 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full shadow-[0_2px_3px_rgb(0_0_0/0.45)] ${head}`} style={{ left: `${x}%` }} />;
}

/** A strip of masking tape over the paper's top edge, a touch off straight. */
export function Tape({ tilt = -4 }: { tilt?: number }) {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-3 left-1/2 z-10 h-6 w-[38%] border border-[rgb(200_180_130/0.5)] bg-[rgb(245_235_200/0.62)] backdrop-blur-[1px]"
      style={{ transform: `translateX(-50%) rotate(${tilt}deg)` }}
    />
  );
}

const tones = {
  /** Cream paper, dark ink: the sheets and index cards. */
  cream: "bg-surface text-ink",
  /** A white print, for the badger mark. */
  white: "bg-white text-neutral-900",
  /** The red card that closes the page: red paper, white ink (the `theme-red` tokens). */
  red: "theme-red",
};

/** A sheet of paper pinned to the board, at a small tilt, with two pins at the corners, one in the middle, or none. */
export function Sheet({ tone = "cream", tilt = 0, pins = 2, className = "", children }: { tone?: keyof typeof tones; tilt?: number; pins?: 0 | 1 | 2; className?: string; children: ReactNode }) {
  const pinTone = tone === "red" ? "brass" : "red";
  return (
    <div className={`relative p-6 shadow-[0_14px_30px_-12px_rgb(40_20_5/0.7)] md:p-10 ${tones[tone]} ${className}`} style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}>
      {pins === 1 && <Pin tone={pinTone} />}
      {pins === 2 && (
        <>
          <Pin x={5} tone={pinTone} />
          <Pin x={95} tone={pinTone} />
        </>
      )}
      {children}
    </div>
  );
}

/** One Polaroid pinned to the board on its own: white frame, square picture, a short caption underneath. */
export function Polaroid({ src, alt, caption, tilt = 0, sizes = "(min-width: 768px) 33vw, 100vw", className = "" }: { src: string; alt: string; caption: string; tilt?: number; sizes?: string; className?: string }) {
  return (
    <figure className={`relative bg-white p-[6%] pb-[5%] shadow-[0_10px_24px_-10px_rgb(40_20_5/0.7)] ${className}`} style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}>
      <Pin />
      <div className="image-frame aspect-square">
        <Image src={src} alt={alt} fill unoptimized sizes={sizes} className="object-cover" />
      </div>
      <figcaption className="mt-[7%] truncate font-serif text-[13px] italic leading-none text-neutral-500 md:text-sm">{caption}</figcaption>
    </figure>
  );
}
