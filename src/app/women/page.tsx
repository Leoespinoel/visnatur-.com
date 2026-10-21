import { audienceMetadata } from "@/components/AudienceShop";
import { BannerSlider } from "@/components/landing/BannerSlider";
import { CategoryMosaic } from "@/components/landing/CategoryMosaic";
import { ExploreCarousel } from "@/components/landing/ExploreCarousel";
import { HeroSlider } from "@/components/landing/HeroSlider";
import { StoryBand } from "@/components/landing/StoryBand";
import { bannerSlides, categoryTiles, explore, favourites, heroSlides, stories } from "@/data/women";

export const metadata = audienceMetadata("women");

/**
 * The women's landing page, the same build as /men (after ralphlauren.com/men). Bands below the hero
 * run white, black, (banner), grey, red, ending on red above the footer. Every women's piece is at /women/all.
 */
export default function WomenPage() {
  return (
    <>
      <HeroSlider slides={heroSlides} label="Women" />
      <CategoryMosaic title="Women’s pieces" tiles={categoryTiles} />
      <StoryBand tone="dark" {...stories} />
      <BannerSlider slides={bannerSlides} label="The wild and the workshop" />
      <StoryBand tone="grey" {...favourites} />
      <ExploreCarousel className="theme-red" {...explore} />
    </>
  );
}
