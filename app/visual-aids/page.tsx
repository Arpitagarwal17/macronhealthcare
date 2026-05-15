import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

export const metadata = {
  title: "Visual Aids | Macron Health Care",
};

export default function VisualAidsPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 space-y-3">
          <p className="field-label text-blue">Visual Aids</p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Visual Aids
          </h1>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
