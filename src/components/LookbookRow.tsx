import Image from "next/image";
import Link from "next/link";

export type LookbookImage = { image: string; alt: string; href: string };

/** Four tall lookbook images under a campaign block (two across on phones), each linking to the pieces. */
export function LookbookRow({ images }: { images: LookbookImage[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 py-1.5 md:grid-cols-4 md:gap-2 md:py-2">
      {images.map((img) => (
        <Link key={img.image} href={img.href} className="group relative block aspect-[3/4] overflow-hidden bg-paper-2">
          <Image src={img.image} alt={img.alt} fill unoptimized sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        </Link>
      ))}
    </div>
  );
}
