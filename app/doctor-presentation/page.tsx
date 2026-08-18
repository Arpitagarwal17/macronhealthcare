import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogAudienceBanner from "@/components/CatalogAudienceBanner";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

const DESCRIPTION =
  "Browse Macron Health Care product visual aids and build a presentation for healthcare professionals - view, share, or export as PDF or PPT.";

export const metadata: Metadata = {
  title: "Doctor Presentation",
  description: DESCRIPTION,
  alternates: { canonical: "/doctor-presentation" },
  openGraph: {
    url: "/doctor-presentation",
    title: "Doctor Presentation | Macron Health Care",
    description: DESCRIPTION,
  },
};

export default function DoctorPresentationPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-7 max-w-3xl space-y-3">
          <p className="field-label text-tealDark">Visual aid library</p>
          <h1 className="text-4xl font-extrabold text-ink sm:text-5xl">
            Doctor Presentation
          </h1>
          <p className="text-base leading-7 text-slate sm:text-lg">
            Select products and create a quick doctor presentation basket.
          </p>
        </div>

        <div className="mb-8">
          <CatalogAudienceBanner current="presentation" />
        </div>

        <Suspense
          fallback={
            <div className="surface-card p-8 text-slate">
              Loading doctor presentation catalogue...
            </div>
          }
        >
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </section>
  );
}
