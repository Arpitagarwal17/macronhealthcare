import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";
import { pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: "Doctor Presentation | Macron Health Care",
  description:
    "Create and view professional product presentations from Macron Health Care for healthcare professionals and doctors.",
  path: "/doctor-presentation",
});

export default function DoctorPresentationPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 max-w-3xl space-y-3">
          <p className="field-label text-blue">Doctor Presentation</p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
            Doctor Presentation
          </h1>
          <p className="text-base font-semibold leading-7 text-slate sm:text-lg">
            Select products and create a quick doctor presentation basket.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
