import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

export const metadata = {
  title: "Our Brand Portfolio | Macron Health Care",
};

export default function ProductsPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mb-8 flex flex-col gap-3">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          Our Brand Portfolio
        </h1>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
