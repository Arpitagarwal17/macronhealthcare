import type { Metadata } from "next";
import CatalogHeader from "@/components/CatalogHeader";
import { VisualAidPortfolioCatalog } from "@/components/CatalogSearchBoundary";
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
        <div className="mb-8">
          <CatalogHeader current="presentation" />
        </div>

        <VisualAidPortfolioCatalog products={products} />
      </div>
    </section>
  );
}
