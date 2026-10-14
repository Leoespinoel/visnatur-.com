import Image from "next/image";
import Link from "next/link";
import { articleHref, kindLabels, readLabel, type Article } from "@/data/stories";

/**
 * A story in a row or grid, laid out like redbull.com's story cards: the picture (with a play mark on
 * films), title, two lines, then the kind and the reading or running time along the foot.
 */
export function ArticleCard({ article, sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" }: { article: Article; sizes?: string }) {
  return (
    <Link href={articleHref(article)} className="group flex h-full flex-col">
      <div className="image-frame aspect-[4/5]">
        <Image src={article.image} alt={article.alt} fill unoptimized sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        {article.video && <PlayMark className="absolute bottom-4 left-4" />}
      </div>
      <h3 className="display mt-4 text-2xl md:text-[1.75rem]">{article.title}</h3>
      <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-relaxed text-ink-2">{article.dek}</p>
      <p className="mt-auto flex items-center justify-between gap-4 pt-5 text-[11px] uppercase tracking-[0.14em] text-muted">
        <span className="font-semibold text-ink">{kindLabels[article.kind]}</span>
        <span>{readLabel(article)}</span>
      </p>
    </Link>
  );
}

/** The round white play button used on film posters. */
export function PlayMark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-white/85 text-[#0a0a0a] backdrop-blur ${className}`} aria-hidden="true">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  );
}
