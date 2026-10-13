import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { audiences, categories, type AudienceSlug } from "@/data/site";
import { isFor, products } from "@/data/products";
import { getInventory } from "@/lib/inventory";
import { currentDrop, formatDropDate, listableProducts, nextDrop, windowLabel } from "@/lib/editions";
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

/** /men, /women and their categories: the usual listing, narrowed to the pieces cut for that audience. */
export async function AudienceShop({ audience, category }: { audience: AudienceSlug; category?: string }) {
  const { a, cat } = lookup(audience, category);
  if (category !== undefined && !cat) notFound();
  const inventory = await getInventory();
  const items = listableProducts(inventory, products.filter((p) => isFor(p, audience) && (!cat || p.category === cat.slug)));
  const drop = currentDrop(inventory.now);
  const next = nextDrop(inventory.now);

  return (
    <>
      <PageIntro
        variant="listing"
        eyebrow={`${a.name} · ${drop ? `${drop.name} · ${windowLabel(drop, inventory.now)}` : "Between drops"}`}
        title={cat ? cat.name : a.name}
        // Category copy is written for the men's range, so Women keeps to its own line.
        lede={cat ? (audience === "men" ? cat.description : undefined) : a.lede}
      />
      <section className="container-x pb-10">
        {items.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted">
            {audience === "women" ? (
              <>
                <p>Nothing here is cut for women yet. The first women&rsquo;s pieces follow in the next drops.</p>
                <p className="mt-2">
                  Until then, the hoodies, caps and socks are cut for anyone.{" "}
                  <Link href="/women" className="link-underline text-ink">
                    See them all
                  </Link>
                </p>
              </>
            ) : (
              <p>
                Every design here has closed or found its owners.{next ? ` ${next.name} opens ${formatDropDate(next.opens)}.` : " New designs are coming."}
              </p>
            )}
          </div>
        ) : (
          <Suspense fallback={<ProductGrid products={items} inventory={inventory} />}>
            <ShopGrid products={items} inventory={inventory} fixedCategory={cat?.slug} base={`/${audience}`} />
          </Suspense>
        )}
      </section>
    </>
  );
}
