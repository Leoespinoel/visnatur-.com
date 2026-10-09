import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editionLabel, editionKindLabel, getProduct, isOneOfOne, productImages, products, productsInCategory } from "@/data/products";
import { categories } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { availabilityOf, dropOf, isArchived, isReleased, listableProducts } from "@/lib/editions";
import { getInventory } from "@/lib/inventory";
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
    title: `${p.name} · ${editionLabel(p)} · ${editionKindLabel(p)}`,
    description: p.description,
    openGraph: { images: [{ url: productImages(p)[0] }] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const inventory = await getInventory();
  // Designs in a drop that has not opened yet do not exist to the public.
  if (!isReleased(product, inventory.now)) notFound();

  const category = categories.find((c) => c.slug === product.category)!;
  const images = productImages(product);
  const availability = availabilityOf(product, inventory);
  const done = isArchived(availability);
  const related = listableProducts(inventory, productsInCategory(product.category))
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  const eyebrow =
    availability.state === "sold"
      ? isOneOfOne(product) ? "Sold" : "Sold out"
      : availability.state === "closed"
        ? "Orders closed"
        : `${editionKindLabel(product)} · ${dropOf(product).name}`;

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-x pt-6 text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="link-underline">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/shop/${category.slug}`} className="link-underline">
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
                  className={`object-cover ${done ? "grayscale" : ""}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow mb-3">
              <span className={done ? "text-red" : ""}>{eyebrow}</span>
              {product.badge && !done ? ` · ${product.badge}` : ""}
            </p>
            <h1 className="display text-4xl md:text-5xl">{product.name}</h1>
            <p className="mt-3 text-lg tabular-nums">{formatPrice(product.price)}</p>
            <p className="mt-5 text-sm leading-relaxed text-ink-2">{product.description}</p>
            <div className="mt-8">
              <ProductDetails product={product} availability={availability} inventory={inventory} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x border-t border-line pt-16">
          <SectionHeading eyebrow={category.name} title="Still available." link={{ label: `All ${category.short}`, href: `/shop/${category.slug}` }} />
          <ProductGrid products={related} inventory={inventory} />
        </section>
      )}
    </>
  );
}
