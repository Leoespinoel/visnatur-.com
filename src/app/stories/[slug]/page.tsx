import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, getArticle, kindLabels, monthLabel, type Article, type Block } from "@/data/stories";
import { ArticleCard } from "@/components/ArticleCard";
import { Newsletter } from "@/components/Newsletter";

type Props = { params: Promise<{ slug: string }> };

/** Where each kind lives on /stories, for the breadcrumb. */
const kindAnchor: Record<Article["kind"], string> = { film: "#latest", journal: "#latest", interview: "#interviews", letter: "#latest" };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title.replace(/\.$/, ""),
    description: a.dek,
    openGraph: { type: "article", images: [{ url: a.image }] },
  };
}

function BodyBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mt-6 text-base leading-relaxed text-ink-2 first:mt-0 md:text-lg">{block.text}</p>;
    case "quote":
      return (
        <blockquote className="my-12 border-l-2 border-red pl-6 md:my-16 md:pl-8">
          <p className="display text-3xl md:text-4xl">{block.text}</p>
          {block.by && <footer className="eyebrow mt-4">{block.by}</footer>}
        </blockquote>
      );
    case "image":
      return (
        <figure className="my-12 md:my-16">
          {block.size ? (
            <div className="flex justify-center bg-surface px-8 py-14 md:py-20">
              <Image src={block.src} alt={block.alt} width={block.size.width} height={block.size.height} unoptimized className="h-auto w-full max-w-md" />
            </div>
          ) : (
            // Photos keep their own shape; tall ones stop short of the screen height.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={block.src} alt={block.alt} loading="lazy" className="mx-auto h-auto max-h-[85svh] w-auto max-w-full" />
          )}
          {block.caption && <figcaption className="mt-3 text-center text-xs text-muted">{block.caption}</figcaption>}
        </figure>
      );
    case "qa":
      return (
        <div className="mt-8 first:mt-0">
          <p className="text-base font-medium leading-relaxed text-ink md:text-lg">{block.q}</p>
          <p className="mt-2 text-base leading-relaxed text-ink-2 md:text-lg">{block.a}</p>
        </div>
      );
  }
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const label = kindLabels[article.kind];

  const heading = (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="eyebrow flex flex-wrap items-center gap-2">
          <li>
            <Link href="/stories" className="link-underline hover:text-ink">
              In the wild
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/stories${kindAnchor[article.kind]}`} className="link-underline hover:text-ink">
              {label}
            </Link>
          </li>
        </ol>
      </nav>
      <h1 className="display mt-6 text-5xl md:text-7xl">{article.title}</h1>
      <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 md:text-lg">{article.dek}</p>
      <p className="eyebrow mt-6">{monthLabel(article.month)}</p>
    </>
  );

  return (
    <>
      <article className="pb-16 md:pb-24">
        {article.video ? (
          // Films: the heading, then the film across the page.
          <>
            <header className="container-x pt-10 pb-10 md:pt-14 md:pb-14">{heading}</header>
            <div className="container-x">
              <video src={article.video} poster={article.image} controls playsInline preload="metadata" className="aspect-video w-full bg-[#0a0a0a]" aria-label={article.title} />
            </div>
          </>
        ) : (
          // Writing: the heading beside the picture.
          <header className="container-x grid gap-10 pt-10 md:grid-cols-12 md:items-end md:pt-14">
            <div className="md:col-span-6 md:pb-4">{heading}</div>
            <div className="image-frame aspect-[4/5] md:col-span-5 md:col-start-8">
              <Image src={article.image} alt={article.alt} fill unoptimized preload sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
            </div>
          </header>
        )}

        <div className="container-x mt-14 md:mt-20">
          <div className="mx-auto max-w-2xl">
            {article.body.map((b, i) => (
              <BodyBlock key={i} block={b} />
            ))}
            {article.links.length > 0 && (
              <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-8 md:mt-16">
                {article.links.map((l) => (
                  <Link key={l.href} href={l.href} className="btn btn-outline">
                    {l.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* More stories on grey, then the newsletter in red above the trust row */}
      <section className="bg-surface py-16 md:py-24">
        <div className="container-x">
          <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
            <h2 className="display text-4xl md:text-5xl">More stories.</h2>
            <Link href="/stories" className="eyebrow !text-ink link-underline w-fit">
              All stories
            </Link>
          </div>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((a) => (
              <ArticleCard key={a.slug} article={a} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
            ))}
          </div>
        </div>
      </section>

      <Newsletter context="stories" />
    </>
  );
}
