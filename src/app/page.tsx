import Link from "next/link";
import { site } from "@/data/site";
import { featuredProducts, interleaveFamilies, productsInCategory } from "@/data/products";
import { campaigns, type Campaign } from "@/data/campaigns";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Carousel } from "@/components/Carousel";
import { CampaignBlock } from "@/components/CampaignBlock";
import { LookbookRow } from "@/components/LookbookRow";
import { LabelTile } from "@/components/LabelTile";
import { FilmBlock } from "@/components/FilmBlock";
import { Newsletter } from "@/components/Newsletter";
import { Playlist } from "@/components/Playlist";
import { HeroFilm } from "@/components/HeroFilm";
import { CommunityCard } from "@/components/CommunityCard";
import { BadgerRows } from "@/components/BadgerRows";
import { communityPosts } from "@/data/community";
import { atelierFilm } from "@/data/film";

/** The row under a campaign image: a five-up product carousel or four lookbook images. */
function CampaignRow({ campaign }: { campaign: Campaign }) {
  const { row } = campaign;
  if (row.kind === "lookbook") return <LookbookRow images={row.images} />;
  const items = row.kind === "featured" ? featuredProducts(10) : interleaveFamilies(productsInCategory(row.category));
  if (items.length === 0) return null;
  return (
    <div className="container-x py-10 md:py-12">
      <ProductCarousel variant="kith" title={campaign.title} products={items} link={{ label: "Shop all", href: campaign.primary.href }} />
    </div>
  );
}

export default function HomePage() {
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
          <CampaignRow campaign={c} />
        </div>
      ))}

      {/* Half-width pair, like Kith's "Apparel | Accessories" */}
      <section className="grid gap-1.5 pt-1.5 md:grid-cols-2 md:gap-2 md:pt-2">
        <LabelTile href="/shop/outerwear-accessories" image="/images/caps-scene.jpg" label="Caps" cta="Shop now" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
        <LabelTile href="/made-to-order" image="/images/numbered-label.jpg?v=2" label="Made to order" cta="A closer look" aspect="aspect-[4/5] md:aspect-[6/7]" sizes="(min-width: 768px) 50vw, 100vw" />
      </section>

      {/* The making-of, as a campaign */}
      <div className="pt-1.5 md:pt-2">
        <FilmBlock {...atelierFilm} text="Every piece is cut and sewn by hand, to order, in a small workshop in Mauritius." link={{ label: "A closer look", href: "/made-to-order" }} />
      </div>

      {/* Community: tall cards of people in the clothes, some playable */}
      <section className="relative overflow-hidden py-16 md:py-24">
        {/* The drifting badgers from behind the pledge figure on /conservation */}
        <BadgerRows rows={24} />
        <div className="relative">
          <h2 className="display text-center text-4xl md:text-5xl">Community</h2>
          <p className="mb-8 mt-4 text-center md:mb-10">
            <Link href="/stories#community" className="eyebrow !text-ink link-underline">
              More stories
            </Link>
          </p>
          <Carousel ariaLabel="Community" itemClassName="w-[62%] sm:w-[40%] md:w-[calc((100%-2rem)/4.3)] lg:w-[calc((100%-2.5rem)/5.3)]" gap="gap-1.5 md:gap-2">
            {communityPosts.map((post, i) => (
              <CommunityCard key={i} post={post} />
            ))}
          </Carousel>
        </div>
      </section>

      {/* The playlist, on black between the community and the red newsletter */}
      <Playlist />

      <Newsletter />
    </>
  );
}
