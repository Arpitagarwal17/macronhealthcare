import type { Metadata } from "next";
import BasketPageClient from "@/components/BasketPageClient";
import { products } from "@/data/products";
import { absoluteUrl } from "@/data/seo";

export const metadata: Metadata = {
  title: "Presentation Basket | Macron Health Care",
  alternates: {
    canonical: absoluteUrl("/basket"),
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function BasketPage() {
  return <BasketPageClient products={products} />;
}
