import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { designNumber, getProduct, isFor, productImages, products } from "@/data/products";
import { isAvailable } from "@/data/availability";
import { productsIn, sectionOf, streetFamilies, v2Href } from "@/data/v2";
import { formatPrice } from "@/lib/format";
import { V2BuyBox } from "@/components/v2/BuyBox";
import { V2Grid } from "@/components/v2/ProductTile";
import { Sticker, Tape } from "@/components/v2/Sticker";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return {
    title: `${p.name} · ${p.colour.name} · ${designNumber(p)}`,
    description: p.description,
    openGraph: { images: [{ url: productImages(p)[0] }] },
  };
}

export default async function V2ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const section = sectionOf(product);
  const images = productImages(product);
  const available = isAvailable(product);
  // More from the same section, for whoever this piece is cut for.
  const cutFor = (["men", "women"] as const).filter((a) => isFor(product, a));
  const related = section
    ? streetFamilies(productsIn(section).filter((p) => p.family !== product.family && cutFor.some((a) => isFor(p, a)))).slice(0, 4)
    : [];

  return (
    <>
      <nav aria-label="Breadcrumb" className="v2-mono border-b-[1.5px] border-ink px-4 py-3 text-muted md:px-6">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={v2Href.shop} className="hover:text-ink">
              Shop
            </Link>
          </li>
          {section && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={v2Href.section(section.slug)} className="hover:text-ink">
                  {section.label}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="grid lg:grid-cols-12">
        {/* Pictures: packshot, on model, detail, each in its own bordered cell */}
        <div className="lg:col-span-7 lg:border-r-[1.5px] lg:border-ink">
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto lg:block lg:overflow-visible">
            {images.map((src, i) => (
              <div key={src} className="relative aspect-[4/5] w-[86vw] shrink-0 snap-start border-b-[1.5px] border-r-[1.5px] border-ink bg-white sm:w-[60vw] lg:w-full lg:border-r-0">
                <Image
                  src={src}
                  alt={i === 0 ? `${product.name} in ${product.colour.name}` : i === images.length - 1 ? `${product.name}, close up` : `${product.name}, worn`}
                  fill
                  unoptimized
                  priority={i === 0}
                  sizes="(min-width: 1024px) 58vw, 86vw"
                  className="object-cover"
                />
                {i === 0 && !available && <Tape tilt={-5} className="absolute left-6 top-6 !text-[0.8rem]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="px-4 pb-12 pt-6 md:px-6 lg:sticky lg:top-16 lg:pt-8">
            <p className="v2-mono text-muted">
              {designNumber(product)}
              {section ? ` · ${section.one}` : ""} · Made to order
            </p>
            <h1 className="v2-display mt-3 text-[16vw] sm:text-[10vw] lg:text-[5.4rem] xl:text-[6.4rem]">{product.name}</h1>
            <div className="mt-4 flex items-center gap-4">
              <p className="v2-display text-[2.6rem] text-red">{formatPrice(product.price)}</p>
              {available ? (
                <Sticker tone="black" tilt={-3} className="text-[0.7rem]">
                  Order now
                </Sticker>
              ) : (
                <Sticker tilt={3} className="text-[0.7rem]">
                  Coming soon
                </Sticker>
              )}
            </div>
            <p className="mt-5 max-w-prose text-sm leading-relaxed text-ink-2">{product.description}</p>
            <div className="mt-4">
              <V2BuyBox product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && section && (
        <section className="border-t-[1.5px] border-ink">
          <div className="flex items-end justify-between gap-4 px-4 pb-5 pt-10 md:px-6">
            <h2 className="v2-display text-[13vw] md:text-[6rem]">More {section.label}</h2>
            <Link href={v2Href.section(section.slug)} className="v2-btn v2-btn-outline shrink-0">
              All {section.label}
            </Link>
          </div>
          <V2Grid groups={related} priorityCount={0} />
        </section>
      )}
    </>
  );
}
