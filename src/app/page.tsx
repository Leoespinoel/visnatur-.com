import { categories, site } from "@/data/site";
import { alternateAudiences, featuredProducts, productImages, type Product } from "@/data/products";
import { campaigns, communityStories, exploreStories, homeSlides, type Campaign } from "@/data/campaigns";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { StoryPair } from "@/components/StoryPair";
import { StoryCarousel } from "@/components/StoryCarousel";
import type { Story } from "@/components/StoryCopy";
import { CampaignBlock } from "@/components/CampaignBlock";
import { Newsletter } from "@/components/Newsletter";
import { Playlist } from "@/components/Playlist";

/** The white between homepage sections, kept tight like ralphlauren.com (Leo, 2026-10-20). */
const SECTION_PAD = "py-10 md:py-14";

/** A campaign as one half of a pair: its picture, title, line and both links. */
function campaignStory(key: string): Story {
  const c = campaigns.find((c) => c.key === key) as Campaign;
  return { title: c.title, dek: c.text, image: c.image, alt: c.alt, links: c.secondary ? [c.primary, c.secondary] : [c.primary] };
}

/** A Signature piece as a tall story tile, like the Collections row: its category, its name and its on-model shot. */
function productStory(p: Product): Story {
  const images = productImages(p);
  return {
    eyebrow: categories.find((c) => c.slug === p.category)?.name,
    title: p.name,
    image: images.find((i) => i.includes("-model")) ?? images[0],
    alt: `${p.name} in ${p.colour.name}, worn`,
    links: [{ label: "Shop now", href: `/product/${p.slug}` }],
  };
}

/**
 * Homepage, paced like /shop: the full-screen hero slider, the lines and edits, women and men side by side,
 * one row of pieces, the stylists at work, then the community and members pair, the playlist and the newsletter.
 * Pictures alternate with white space so no two full-bleed images sit back to back.
 */
export default function HomePage() {
  return (
    <>
      <h1 className="sr-only">
        {site.name}. {site.tagline}
      </h1>

      {/* 1. Full-screen hero, as on /men and /women: a campaign card per line over a landscape; the header floats over it */}
      <HeroSlider slides={homeSlides} label={site.name} />

      {/* 2. Lines, edits and the workshop */}
      <StoryCarousel title="COLLECTIONS · DIVA" dek="Lines, edits and the workshop behind them." stories={exploreStories} pad={SECTION_PAD} />

      {/* 3. Women and men side by side */}
      <StoryPair stories={[campaignStory("women"), campaignStory("men")]} />

      {/* 4. The featured pieces, alternating the women's line with the rest */}
      <StoryCarousel title="SIGNATURE" dek="The permanent line: always in stock, made by hand in Mauritius." stories={alternateAudiences(featuredProducts(Infinity)).slice(0, 16).map(productStory)} pad={SECTION_PAD} />

      {/* 5. Behind the scenes: stylists at work on a model, full-bleed (Leo, 2026-10-16, in place of the Made by hand film) */}
      <CampaignBlock
        image="/images/atelier/stylists.jpg"
        alt="Two stylists at work on a model on a villa terrace above the sea, one at the collar of her cricket jumper, one kneeling at the hem of her cream linen trousers"
        title="Between takes"
        text="Made by hand in Mauritius, then styled down to the last roll of the cuff. Any Signature piece can be made to order."
        primary={{ label: "Made to order", href: "/made-to-order" }}
      />

      {/* Community, split in two: the people in the pieces and the members' programme, wide on screens, with white space after the picture */}
      <div className={SECTION_PAD}>
        <StoryPair stories={communityStories} aspect="aspect-[4/5] md:aspect-[4/3]" />
      </div>

      {/* The playlist, on black between the community and the red newsletter */}
      <Playlist />

      {/* White between the black playlist and the red letters, as thick as the other gaps on the page (Leo, 2026-10-21). */}
      <div className="h-10 md:h-14" aria-hidden="true" />

      <Newsletter />
    </>
  );
}
