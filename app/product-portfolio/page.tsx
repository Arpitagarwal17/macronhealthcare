import ProductPortfolioClient from "@/components/ProductPortfolioClient";
import { getProductCategory } from "@/data/productCategories";
import { products } from "@/data/products";
import { absoluteUrl, pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: "Product Portfolio | Macron Health Care Jaipur",
  description:
    "View the product portfolio of Macron Health Care, a Jaipur-based pharmaceutical distributor and healthcare product supplier.",
  path: "/product-portfolio",
});

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
        <ProductPortfolioClient products={products} />
      </div>
    </section>
  );
}
