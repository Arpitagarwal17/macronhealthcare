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
        <div className="mb-7 max-w-3xl space-y-3">
          <p className="field-label text-teal">Visual aid library</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
            Doctor Presentation
          </h1>
          <p className="text-base leading-7 text-slate sm:text-lg">
            Select products and create a quick doctor presentation basket.
          </p>
          <p className="text-sm font-semibold text-slate">
            Products intended for trade and healthcare professionals.
          </p>
        </div>

        <ProductGrid products={products} />
      </div>
    </section>
  );
}
