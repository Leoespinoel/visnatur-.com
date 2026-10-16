import { site } from "@/data/site";
import { alternateAudiences, featuredProducts } from "@/data/products";
import { campaigns, communityStories, exploreStories, homeSlides, type Campaign } from "@/data/campaigns";
import { ProductCarousel } from "@/components/ProductCarousel";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { StoryPair } from "@/components/StoryPair";
import { StoryCarousel } from "@/components/StoryCarousel";
import type { Story } from "@/components/StoryCopy";
import { CampaignBlock } from "@/components/CampaignBlock";
import { Newsletter } from "@/components/Newsletter";
import { Playlist } from "@/components/Playlist";

/** A campaign as one half of a pair: its picture, title, line and both links. */
function campaignStory(key: string): Story {
  const c = campaigns.find((c) => c.key === key) as Campaign;
  return { title: c.title, dek: c.text, image: c.image, alt: c.alt, links: c.secondary ? [c.primary, c.secondary] : [c.primary] };
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
      <StoryCarousel title="The collection" dek="Lines, edits and the workshop behind them." stories={exploreStories} />

      {/* 3. Women and men side by side */}
      <StoryPair stories={[campaignStory("women"), campaignStory("men")]} />

      {/* 4. The featured pieces, alternating the women's line with the rest */}
      <div className="container-x py-14 md:py-20">
        <ProductCarousel title="Collection I" products={alternateAudiences(featuredProducts(Infinity)).slice(0, 16)} link={{ label: "Shop all", href: "/shop/all" }} />
      </div>

      {/* 5. Behind the scenes: stylists at work on a model, full-bleed (Leo, 2026-10-16, in place of the Made by hand film) */}
      <CampaignBlock
        image="/images/atelier/stylists.jpg"
        alt="Two stylists at work on a model on a villa terrace above the sea, one at the collar of her cricket jumper, one kneeling at the hem of her cream linen trousers"
        title="Between takes"
        text="Every piece is cut and sewn to order, then styled down to the last roll of the cuff."
        primary={{ label: "A closer look", href: "/made-to-order" }}
      />

      {/* Community, split in two: the people in the pieces and the members' programme, wide on screens, with white space after the picture */}
      <div className="py-14 md:py-20">
        <StoryPair stories={communityStories} aspect="aspect-[4/5] md:aspect-[4/3]" />
      </div>

      {/* The playlist, on black between the community and the red newsletter */}
      <Playlist />

      <Newsletter />
    </>
  );
}
