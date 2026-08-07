import type { Metadata } from "next";
import BasketPageClient from "@/components/BasketPageClient";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Presentation Basket",
  robots: {
    index: false,
    follow: true,
  },
};

export default function BasketPage() {
  return <BasketPageClient products={products} />;
}
