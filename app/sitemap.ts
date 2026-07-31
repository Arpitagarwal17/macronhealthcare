import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { absoluteUrl, SITE_LAST_UPDATED } from "@/data/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const mainPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: SITE_LAST_UPDATED },
    { url: absoluteUrl("/product-portfolio"), lastModified: SITE_LAST_UPDATED },
    { url: absoluteUrl("/doctor-presentation"), lastModified: SITE_LAST_UPDATED },
    { url: absoluteUrl("/company-info"), lastModified: SITE_LAST_UPDATED },
    { url: absoluteUrl("/contact"), lastModified: SITE_LAST_UPDATED },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/doctor-presentation/${product.slug}`),
    lastModified: SITE_LAST_UPDATED,
  }));

  return [...mainPages, ...productPages];
}
