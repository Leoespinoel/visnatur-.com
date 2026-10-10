import { site } from "@/data/site";
import { featuredProducts, productsInCategory } from "@/data/products";
import { campaigns, type Campaign } from "@/data/campaigns";
import { getInventory } from "@/lib/inventory";
import { listableProducts, type Inventory } from "@/lib/editions";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Carousel } from "@/components/Carousel";
import { CampaignBlock } from "@/components/CampaignBlock";
import { LookbookRow } from "@/components/LookbookRow";
import { LabelTile } from "@/components/LabelTile";
import { FilmBlock } from "@/components/FilmBlock";
import { Newsletter } from "@/components/Newsletter";
import { HeroFilm } from "@/components/HeroFilm";
import { CommunityCard } from "@/components/CommunityCard";
import { communityPosts } from "@/data/community";
import { atelierFilm } from "@/data/film";

/** The row under a campaign image: a five-up product carousel or four lookbook images. */
function CampaignRow({ campaign, inventory }: { campaign: Campaign; inventory: Inventory }) {
  const { row } = campaign;
  if (row.kind === "lookbook") return <LookbookRow images={row.images} />;
  const items = row.kind === "featured" ? listableProducts(inventory, featuredProducts(12)).slice(0, 10) : listableProducts(inventory, productsInCategory(row.category));
  if (items.length === 0) return null;
  return (
    <div className="container-x py-10 md:py-12">
      <ProductCarousel variant="kith" title={campaign.title} products={items} inventory={inventory} link={{ label: "Shop all", href: campaign.primary.href }} />
    </div>
  );
}

export default async function HomePage() {
  const inventory = await getInventory();

  return (
    <>
      {/* Hero: the film. Whole thing is one link, chrome floats over it. */}
      <HeroFilm />
      <h1 className="sr-only">
        {site.name}. {site.tagline}
      </h1>

      {/* Campaigns, as on kith.com: full-bleed image, then products or a lookbook row */}
      {campaigns.map((c, i) => (
        <div key={c.key} className="pt-1.5 md:pt-2">
          <CampaignBlock image={c.image} alt={c.alt} title={c.title} text={c.text} primary={c.primary} secondary={c.secondary} preload={i === 0} />
          <CampaignRow campaign={c} inventory={inventory} />
        </div>
      ))}

      {/* Half-width pair, like Kith's "Apparel | Accessories" */}
      <section className="grid gap-1.5 pt-1.5 md:grid-cols-2 md:gap-2 md:pt-2">
        <LabelTile href="/shop/outerwear-accessories" image="/products/marram-cap-ecru-pine.jpg" label="Caps" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
        <LabelTile href="/archive" image="/images/numbered-label.jpg" label="The archive" cta="Browse" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
      </section>

      {/* The making-of, as a campaign */}
      <div className="pt-1.5 md:pt-2">
        <FilmBlock {...atelierFilm} text="Every edition is cut, sewn and numbered by hand in a small workshop in Mauritius." link={{ label: "A closer look", href: "/made-to-order" }} />
      </div>

      {/* Community: tall cards of people in the clothes, some playable */}
      <section className="py-16 md:py-24">
        <h2 className="display mb-8 text-center text-4xl md:mb-10 md:text-5xl">Community</h2>
        <Carousel ariaLabel="Community" itemClassName="w-[62%] sm:w-[40%] md:w-[calc((100%-2rem)/4.3)] lg:w-[calc((100%-2.5rem)/5.3)]" gap="gap-1.5 md:gap-2">
          {communityPosts.map((post, i) => (
            <CommunityCard key={i} post={post} />
          ))}
        </Carousel>
      </section>

      <Newsletter />
    </>
  );
}
