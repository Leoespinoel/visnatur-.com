import { audienceMetadata } from "@/components/AudienceShop";
import { BannerSlider } from "@/components/landing/BannerSlider";
import { CategoryMosaic } from "@/components/landing/CategoryMosaic";
import { ExploreCarousel } from "@/components/landing/ExploreCarousel";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { StoryBand } from "@/components/landing/StoryBand";
import { bannerSlides, categoryTiles, explore, favourites, heroSlides, stories } from "@/data/men";

export const metadata = audienceMetadata("men");

/**
 * The men's landing page, after ralphlauren.com/men. Bands below the hero run white, black,
 * (banner), grey, red, so the page ends on red above the footer like the other editorial pages.
 * Every men's piece is at /men/all.
 */
export default function MenPage() {
  return (
    <>
      <HeroSlider slides={heroSlides} label="Men" />
      <CategoryMosaic title="Men’s categories" tiles={categoryTiles} />
      <StoryBand tone="dark" {...stories} />
      <BannerSlider slides={bannerSlides} label="The wild and the workshop" />
      <StoryBand tone="grey" {...favourites} />
      <ExploreCarousel className="theme-red" {...explore} />
    </>
  );
}
