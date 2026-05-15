import BasketPageClient from "@/components/BasketPageClient";
import { products } from "@/data/products";

export const metadata = {
  title: "Presentation Basket | Macron Health Care",
};

export default function BasketPage() {
  return <BasketPageClient products={products} />;
}
