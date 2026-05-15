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

        <div className="rounded-[1.1rem] border border-line bg-white p-4 shadow-soft sm:flex sm:items-center sm:gap-5">
          <div className="mb-4 sm:mb-0">
            <p className="field-label">Product List</p>
            <p className="mt-2 text-sm font-semibold text-ink">
              Macron Product List 2026
            </p>
          </div>
          <a
            href="/downloads/macron-product-list-2026.pdf"
            download
            className="primary-button w-full sm:w-auto"
          >
            Download PDF
          </a>
        </div>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
