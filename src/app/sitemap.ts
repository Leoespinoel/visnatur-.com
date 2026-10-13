import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { categories, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const statics = ["", "/shop", "/shop/all", "/made-to-order", "/conservation", "/about", "/contact", "/legal/terms", "/legal/privacy", "/legal/returns", "/pitch"];
  return [
    ...statics.map((p) => ({ url: `${base}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.6 })),
    ...categories.map((c) => ({ url: `${base}/shop/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/product/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
