import type { Metadata } from "next";
import { Suspense } from "react";
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
  return (
    <Suspense
      fallback={
        <section className="page-shell py-10" role="status">
          <div className="surface-card p-8 text-center text-slate">
            Loading presentation basket…
          </div>
        </section>
      }
    >
      <BasketPageClient products={products} />
    </Suspense>
  );
}
