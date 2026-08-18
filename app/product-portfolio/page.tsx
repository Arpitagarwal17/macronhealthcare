import type { Metadata } from "next";
import { Suspense } from "react";
import ProductPortfolioClient from "@/components/ProductPortfolioClient";
import { getProductCategory } from "@/data/productCategories";
import { products } from "@/data/products";
import { absoluteUrl } from "@/data/seo";

const DESCRIPTION =
  "Browse branded pharmaceutical formulations from Macron Health Care - tablets, capsules, syrups, dry syrups and injections, with compositions.";

export const metadata: Metadata = {
  title: "Product Portfolio",
  description: DESCRIPTION,
  alternates: { canonical: "/product-portfolio" },
  openGraph: {
    url: "/product-portfolio",
    title: "Product Portfolio | Macron Health Care",
    description: DESCRIPTION,
  },
};

export default function ProductPortfolioPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Macron Health Care Product Portfolio",
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/product-portfolio/${product.slug}`),
      item: {
        "@type": "Product",
        name: product.brandName,
        description: product.composition,
        category: getProductCategory(product.dosageForm),
        image: absoluteUrl(product.visualAidImage),
      },
    })),
  };

  return (
    <section className="page-shell py-10 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(itemListSchema).replace(/</g, "\\u003c"),
        }}
      />
      <div className="mx-auto max-w-[1200px]">
        <Suspense
          fallback={
            <div className="surface-card p-8 text-slate">
              Loading product portfolio...
            </div>
          }
        >
          <ProductPortfolioClient products={products} />
        </Suspense>
      </div>
    </section>
  );
}
