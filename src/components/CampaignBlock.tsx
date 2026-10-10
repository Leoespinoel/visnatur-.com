import Image from "next/image";
import Link from "next/link";

type CampaignLink = { label: string; href: string };

/**
 * Full-bleed campaign image in the Kith manner: serif title and one line of copy bottom-left,
 * outlined buttons bottom-right (stacked under the copy on phones). The whole image links to `primary`.
 */
export function CampaignBlock({
  image,
  alt,
  title,
  text,
  primary,
  secondary,
  preload = false,
}: {
  image: string;
  alt: string;
  title: string;
  text?: string;
  primary: CampaignLink;
  secondary?: CampaignLink;
  preload?: boolean;
}) {
  return (
    <section className="relative aspect-[4/5] w-full overflow-hidden bg-[#0a0a0a] text-white sm:aspect-[16/9] md:aspect-[16/7]" aria-label={title}>
      <Link href={primary.href} aria-label={title} className="group absolute inset-0">
        <Image src={image} alt={alt} fill unoptimized preload={preload} sizes="100vw" className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.02]" />
      </Link>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
      <div className="container-x pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-5 pb-7 md:flex-row md:items-end md:justify-between md:pb-10">
        <div className="max-w-xl">
          <h2 className="display text-4xl md:text-5xl">{title}</h2>
          {text && <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/80">{text}</p>}
        </div>
        <div className="pointer-events-auto flex gap-2">
          <Link href={primary.href} className="btn btn-ghost min-w-[140px]">
            {primary.label}
          </Link>
          {secondary && (
            <Link href={secondary.href} className="btn btn-ghost min-w-[140px]">
              {secondary.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
