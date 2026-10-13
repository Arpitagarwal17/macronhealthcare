import type { Metadata } from "next";
import { ProductPortfolioCatalog } from "@/components/CatalogSearchBoundary";
import { products } from "@/data/products";
import { absoluteUrl } from "@/data/seo";
import { getProductDisplayName } from "@/lib/productSeo";

const DESCRIPTION =
  "Explore Macron Health Care product photos, compositions and dosage forms. Download the latest product card and MRP list.";

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
      name: getProductDisplayName(product),
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
        <ProductPortfolioCatalog products={products} />
      </div>
    </section>
  );
}
