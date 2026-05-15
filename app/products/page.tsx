import ProductGrid from "@/components/ProductGrid";
import ProductDownloadPanel from "@/components/ProductDownloadPanel";
import { products } from "@/data/products";

export const metadata = {
  title: "Our Brand Portfolio | Macron Health Care",
};

export default function ProductsPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="field-label text-blue">Brands</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Our Brand Portfolio
            </h1>
          </div>

          <div className="w-full lg:max-w-[520px]">
            <ProductDownloadPanel compact />
          </div>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
