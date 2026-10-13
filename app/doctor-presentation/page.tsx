import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogAudienceBanner from "@/components/CatalogAudienceBanner";
import ProductGrid from "@/components/ProductGrid";
import { products } from "@/data/products";

const DESCRIPTION =
  "Browse Macron Health Care visual aids, add products to your basket, and export your presentation as PDF or PowerPoint.";

export const metadata: Metadata = {
  title: "Visual Aid Portfolio",
  description: DESCRIPTION,
  alternates: { canonical: "/doctor-presentation" },
  openGraph: {
    url: "/doctor-presentation",
    title: "Visual Aid Portfolio | Macron Health Care",
    description: DESCRIPTION,
  },
};

export default function DoctorPresentationPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-7 max-w-3xl space-y-3">
          <p className="eyebrow">Visual aid library</p>
          <h1 className="page-heading">
            Visual Aid Portfolio
          </h1>
          <p className="text-base leading-7 text-slate sm:text-lg">
            Browse visual aids, add products to your basket, and export your
            presentation as PDF or PowerPoint.
          </p>
        </div>

        <div className="mb-8">
          <CatalogAudienceBanner current="presentation" />
        </div>

        <Suspense
          fallback={
            <div className="surface-card p-8 text-slate">
              Loading visual aid portfolio...
            </div>
          }
        >
          <ProductGrid products={products} />
        </Suspense>
      </div>
    </section>
  );
}
