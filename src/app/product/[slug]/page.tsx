import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { designNumber, getProduct, isFor, productImages, products, productsInCategory } from "@/data/products";
import { categories } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { ProductDetails } from "@/components/ProductDetails";
import { ProductGrid } from "@/components/ProductGrid";
import { SectionHeading } from "@/components/SectionHeading";

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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category)!;
  const images = productImages(product);
  // Suggest pieces for whoever this one is cut for (a women's swimsuit doesn't suggest men's swim shorts).
  const cutFor = (["men", "women"] as const).filter((a) => isFor(product, a));
  const related = productsInCategory(product.category)
    .filter((p) => p.family !== product.family && cutFor.some((a) => isFor(p, a)))
    .slice(0, 8);
  // Pieces cut for women sit under Women; everything else keeps the shop trail.
  const trail = product.audience === "women" ? { label: "Women", href: "/women" } : { label: "Shop", href: "/shop" };

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-x pt-6 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href={trail.href} className="link-underline">
              {trail.label}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`${trail.href}/${category.slug}`} className="link-underline">
              {category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-ink" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="container-x grid gap-10 pt-6 pb-16 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {images.map((src, i) => (
              <div key={src} className="image-frame aspect-[4/5]">
                <Image
                  src={src}
                  alt={i === 0 ? `${product.name} in ${product.colour.name}` : `${product.name}, fabric detail`}
                  fill
                  unoptimized
                  priority={i === 0}
                  sizes="(min-width: 1280px) 30vw, (min-width: 1024px) 58vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-3">
              Made to order{product.badge ? ` · ${product.badge}` : ""}
            </p>
            <h1 className="display text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg tabular-nums">{formatPrice(product.price)}</p>
            <p className="mt-5 text-sm leading-relaxed text-ink-2">{product.description}</p>
            <div className="mt-8">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x border-t border-line pt-16">
          <SectionHeading eyebrow={category.name} title="You may also like." link={{ label: `All ${category.short}`, href: `/shop/${category.slug}` }} />
          <ProductGrid products={related} />
        </section>
      )}
    </>
  );
}
