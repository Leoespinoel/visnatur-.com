import Link from "next/link";
import Image from "next/image";
import type { MenuTile } from "@/data/menu";
import { comingSoon } from "@/data/availability";
import { ComingSoon } from "./ComingSoon";

/** A tall photo with its label across the bottom, as in the ralphlauren.com mega menu. */
export function MegaTile({ tile }: { tile: MenuTile }) {
  const soon = comingSoon(tile.href);
  if (tile.packshot) {
    return (
      // Packshots are shot on white, so the tile stays white (and the label dark) in either theme.
      <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden border border-line bg-white">
        <Image src={tile.image} alt="" fill unoptimized sizes="20vw" className="object-contain p-6 pb-20 transition-transform duration-700 group-hover:scale-[1.03]" />
        {soon && <ComingSoon />}
        <span className="absolute inset-x-0 bottom-0 px-4 pb-7 text-center font-serif text-[clamp(15px,1.35vw,20px)] uppercase leading-snug tracking-[0.14em] text-[#0a0a0a]">
          {tile.label}
        </span>
      </Link>
    );
  }
  return (
    <Link href={tile.href} className="group relative block aspect-[3/4] overflow-hidden bg-paper-2">
      <Image src={tile.image} alt="" fill unoptimized sizes="20vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      {soon && <ComingSoon />}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-4 pb-7 pt-24 text-center font-serif text-[clamp(15px,1.35vw,20px)] uppercase leading-snug tracking-[0.14em] text-white">
        {tile.label}
      </span>
    </Link>
  );
}
