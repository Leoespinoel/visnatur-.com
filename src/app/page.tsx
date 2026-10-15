import Link from "next/link";
import { site } from "@/data/site";
import { alternateAudiences, featuredProducts } from "@/data/products";
import { campaigns, exploreStories, homeSlides, type Campaign } from "@/data/campaigns";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Carousel } from "@/components/Carousel";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { StoryPair } from "@/components/StoryPair";
import { StoryCarousel } from "@/components/StoryCarousel";
import type { Story } from "@/components/StoryCopy";
import { FilmBlock } from "@/components/FilmBlock";
import { Newsletter } from "@/components/Newsletter";
import { Playlist } from "@/components/Playlist";
import { CommunityCard } from "@/components/CommunityCard";
import { communityPosts } from "@/data/community";
import { atelierFilm } from "@/data/film";

/** A campaign as one half of a pair: its picture, title, line and both links. */
function campaignStory(key: string): Story {
  const c = campaigns.find((c) => c.key === key) as Campaign;
  return { title: c.title, dek: c.text, image: c.image, alt: c.alt, links: c.secondary ? [c.primary, c.secondary] : [c.primary] };
}

/**
 * Homepage, paced like /shop: the full-screen hero slider, the lines and edits, women and men side by side,
 * one row of pieces, the making-of film, then the community, the playlist and the newsletter.
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

      {/* 5. The making-of, full-bleed */}
      <FilmBlock {...atelierFilm} text="Every piece is cut and sewn by hand, to order, in a small workshop in Mauritius." link={{ label: "A closer look", href: "/made-to-order" }} />

      {/* Community: tall cards of people in the clothes, some playable */}
      <section className="py-16 md:py-24">
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
      </section>

      {/* The playlist, on black between the community and the red newsletter */}
      <Playlist />

      <Newsletter />
    </>
  );
}
