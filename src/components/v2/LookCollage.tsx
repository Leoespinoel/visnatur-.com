import Image from "next/image";
import Link from "next/link";
import { looks, piecesOf, v2Href, type Look } from "@/data/v2";
import { Tape } from "./Sticker";

/** Cell shapes for the collage: a big one, a tall one, two small, a wide one, one more. */
const cells = [
  "col-span-12 md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "col-span-6 md:col-span-5 aspect-[4/5]",
  "col-span-6 md:col-span-5 aspect-[4/5]",
  "col-span-6 md:col-span-4 aspect-[4/5]",
  "col-span-6 md:col-span-4 aspect-[4/5]",
  "col-span-12 md:col-span-4 aspect-[4/5]",
];
const tilts = [-3, 4, -2, 3, -4, 2];

function Cell({ look, className, tilt, priority }: { look: Look; className: string; tilt: number; priority: boolean }) {
  const pieces = piecesOf(look.pieces);
  return (
    <Link href={`${v2Href.lookbook}#${look.slug}`} className={`v2-grain group relative block overflow-hidden border-[1.5px] border-paper/80 ${className}`}>
      <Image
        src={look.image}
        alt={look.alt}
        fill
        unoptimized
        priority={priority}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        style={{ objectPosition: look.position }}
      />
      <Tape tilt={tilt} className="absolute left-3 top-3">
        {look.caption}
      </Tape>
      <span className="v2-mono absolute inset-x-0 bottom-0 bg-ink/85 px-3 py-2 text-paper opacity-0 transition-opacity group-hover:opacity-100 [@media(hover:none)]:opacity-100">
        {pieces.map((p) => p.name).join(" + ")} →
      </span>
    </Link>
  );
}

/** Six looks in an uneven grid with taped captions; each opens its place in the lookbook. */
export function LookCollage() {
  return (
    <div className="grid grid-cols-12 gap-2 md:gap-3">
      {looks.slice(0, cells.length).map((look, i) => (
        <Cell key={look.slug} look={look} className={cells[i]} tilt={tilts[i]} priority={false} />
      ))}
    </div>
  );
}
