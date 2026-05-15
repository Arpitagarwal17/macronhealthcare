import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

export const metadata = {
  title: "Our Brand Portfolio | Macron Health Care",
};

export default function ProductsPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="field-label text-blue">Brands</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Our Brand Portfolio
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="/downloads/macron-product-list-2026.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-5 text-sm font-semibold text-ink shadow-soft transition duration-200 hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
            >
              View Product List
            </a>
            <a
              href="/downloads/macron-product-list-2026.pdf"
              download
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-5 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15"
            >
              Download PDF
            </a>
          </div>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
