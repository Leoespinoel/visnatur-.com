import Image from "next/image";

type Picture = { image: string; alt: string };

/**
 * A band of the plush badger pictures sliding across the page on the site's marquee (`reverse` sends it the other way),
 * each frame also floating up and down on its own beat. Decorative: it drifts behind a section's text, so the section
 * is `relative overflow-hidden`, the band sits in an absolute layer and the text after it is `relative`.
 */
export function BadgerBand({ pictures, reverse = false, duration = 70 }: { pictures: Picture[]; reverse?: boolean; duration?: number }) {
  // The track slides by half its width, so each half holds every picture once: nine 4:5 frames are already wider than the screen.
  const items = [...pictures, ...pictures];
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <ul className={`marquee-track gap-3 md:gap-4 ${reverse ? "marquee-reverse" : ""}`} style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}>
        {items.map((p, i) => (
          <li
            key={i}
            className="badger-float image-frame aspect-[4/5] w-[38vw] shrink-0 md:w-[17vw]"
            // Each frame bobs on its own phase and pace, so the band never moves as one block.
            style={{ animationDelay: `${-(i * 1.3) % 7}s`, animationDuration: `${6 + (i % 4)}s` }}
          >
            <Image src={p.image} alt={p.alt} fill unoptimized sizes="(min-width: 768px) 17vw, 38vw" className="object-cover" />
          </li>
        ))}
      </ul>
    </div>
  );
}
