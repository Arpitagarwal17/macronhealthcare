import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

export const metadata = {
  title: "Our Brand Portfolio | Macron Health Care",
};

export default function ProductsPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <p className="field-label text-blue">Brands</p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Our Brand Portfolio
          </h1>
        </div>

        <div className="rounded-[1.1rem] border border-line bg-white p-5 shadow-soft">
          <div className="mb-4">
            <p className="text-base font-semibold text-ink">Macron Health Care</p>
            <p className="mt-1 field-label">Product List</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href="/downloads/macron-product-list-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="secondary-button w-full"
            >
              View PDF
            </a>
            <a
              href="/downloads/macron-product-list-2026.pdf"
              download
              className="primary-button w-full"
            >
              Download PDF
            </a>
          </div>
        </div>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
