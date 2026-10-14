import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { audiences, categories, categoryFeatures, type AudienceSlug } from "@/data/site";
import { isFor, products } from "@/data/products";
import { PageIntro } from "./PageIntro";
import { ShopGrid } from "./ShopGrid";
import { ProductGrid } from "./ProductGrid";

function lookup(audience: AudienceSlug, category?: string) {
  const a = audiences.find((x) => x.slug === audience)!;
  const cat = category === undefined ? undefined : categories.find((c) => c.slug === category);
  return { a, cat };
}

export function audienceMetadata(audience: AudienceSlug, category?: string): Metadata {
  const { a, cat } = lookup(audience, category);
  if (category !== undefined && !cat) return {};
  return cat ? { title: `${a.name} · ${cat.name}`, description: cat.description } : { title: a.name, description: a.lede };
}

/**
 * /men, /women and their categories: the usual listing, narrowed to the pieces cut for that audience.
 * `allHref` is where the "All pieces" chip points when the audience's landing page is not its listing.
 */
export function AudienceShop({ audience, category, allHref }: { audience: AudienceSlug; category?: string; allHref?: string }) {
  const { a, cat } = lookup(audience, category);
  if (category !== undefined && !cat) notFound();
  const items = products.filter((p) => isFor(p, audience) && (!cat || p.category === cat.slug));
  // The women's listings only take the stories whose picture suits them.
  const feature = cat && (audience === "men" || categoryFeatures[cat.slug].women) ? categoryFeatures[cat.slug] : undefined;

  return (
    <>
      <PageIntro
        variant="listing"
        eyebrow={`${a.name} · Made to order`}
        crumbs={cat ? [{ label: a.name, href: `/${audience}` }] : undefined}
        title={cat ? cat.name : a.name}
        // Category copy is written for the men's range, so Women keeps to its own line.
        lede={cat ? (audience === "men" ? cat.description : undefined) : a.lede}
      />
      <section className="container-x pb-10">
        {items.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted">
            {audience === "women" ? (
              <>
                <p>Nothing here is cut for women yet. The first women&rsquo;s pieces follow in the next collection.</p>
                <p className="mt-2">
                  Until then, the hoodies, caps and socks are cut for anyone.{" "}
                  <Link href="/women/all" className="link-underline text-ink">
                    See them all
                  </Link>
                </p>
              </>
            ) : (
              <p>New designs are coming.</p>
            )}
          </div>
        ) : (
          <Suspense fallback={<ProductGrid products={items} />}>
            <ShopGrid products={items} fixedCategory={cat?.slug} base={`/${audience}`} allHref={allHref} feature={feature} />
          </Suspense>
        )}
      </section>
    </>
  );
}
