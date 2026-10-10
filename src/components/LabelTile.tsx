import Image from "next/image";
import Link from "next/link";

/**
 * Image tile with an uppercase label over the bottom of the picture (Kith's category tiles).
 * With `cta`, the label sits bottom-left as a serif title and an outlined button bottom-right.
 */
export function LabelTile({
  href,
  image,
  label,
  cta,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 768px) 25vw, 50vw",
}: {
  href: string;
  image: string;
  label: string;
  cta?: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <Link href={href} className={`group relative block overflow-hidden bg-paper-2 text-white ${aspect}`}>
      <Image src={image} alt="" fill unoptimized sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/55 to-transparent" />
      {cta ? (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-7">
          <span className="display text-3xl md:text-4xl">{label}</span>
          <span className="btn btn-ghost h-10 px-5">{cta}</span>
        </div>
      ) : (
        <span className="absolute inset-x-0 bottom-5 text-center text-[11px] font-semibold uppercase tracking-[0.16em]">{label}</span>
      )}
    </Link>
  );
}
