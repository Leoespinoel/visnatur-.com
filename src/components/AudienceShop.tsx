import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { audiences, categories, categoryFeatures, type AudienceSlug } from "@/data/site";
import { isFor, products } from "@/data/products";
import { menuFor } from "@/data/menu";
import { PageIntro } from "./PageIntro";
import { MegaTile } from "./MegaTile";
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
  const all = products.filter((p) => isFor(p, audience) && (!cat || p.category === cat.slug));
  // On the women's pages the women's line leads; the pieces cut for anyone follow in catalogue order
  // (their `featured` rank is for the shop and the homepage, so it is dropped here).
  const items =
    audience === "women"
      ? [...all.filter((p) => p.audience === "women"), ...all.filter((p) => p.audience !== "women").map((p) => ({ ...p, featured: undefined }))]
      : all;
  // The women's listings only take the stories whose picture suits them.
  const feature = cat && (audience === "men" || categoryFeatures[cat.slug].women) ? categoryFeatures[cat.slug] : undefined;
  // The whole range opens on the menu's "All pieces" tiles, one per kind of piece, in place of the chips and Filter & Sort.
  const explore = cat ? undefined : menuFor(audience).find((i) => i.key === "all");

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
        {explore && (
          <div className="mb-12 border-b border-line pb-12 md:mb-16 md:pb-16">
            <p className="eyebrow border-b border-ink pb-4 !text-ink">{explore.heading}</p>
            <div className="mt-7 grid grid-cols-2 gap-1.5 md:gap-3 lg:grid-cols-4">
              {explore.tiles.map((t) => (
                <MegaTile key={t.label} tile={t} />
              ))}
            </div>
          </div>
        )}
        {items.length === 0 ? (
          <div className="py-20 text-center text-sm text-muted">
            {audience === "women" ? (
              <>
                <p>More pieces for her are on the way.</p>
                <p className="mt-2">
                  <Link href="/women/all" className="link-underline text-ink">
                    See every women&rsquo;s piece
                  </Link>
                </p>
              </>
            ) : (
              <p>New designs are coming.</p>
            )}
          </div>
        ) : (
          <Suspense fallback={<ProductGrid products={items} />}>
            <ShopGrid products={items} fixedCategory={cat?.slug} base={`/${audience}`} allHref={allHref} feature={feature} filters={!explore} />
          </Suspense>
        )}
      </section>
    </>
  );
}
