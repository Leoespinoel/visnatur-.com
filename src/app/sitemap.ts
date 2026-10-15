import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { articles } from "@/data/stories";
import { categories, site } from "@/data/site";
import { editHref, edits } from "@/data/edits";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const statics = ["", "/shop", "/shop/all", "/men", "/men/all", "/men/outfits", "/women", "/women/all", "/women/outfits", "/made-to-order", "/conservation", "/stories", "/about", "/contact", "/legal/terms", "/legal/privacy", "/legal/returns", "/pitch"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${base}/shop/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...edits.map((e) => ({ url: `${base}${editHref(e)}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...articles.map((a) => ({ url: `${base}/stories/${a.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
