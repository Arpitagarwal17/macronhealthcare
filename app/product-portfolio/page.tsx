import ProductPortfolioClient from "@/components/ProductPortfolioClient";
import { products } from "@/data/products";
import { pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: "Product Portfolio | Macron Health Care Jaipur",
  description:
    "View the product portfolio of Macron Health Care, a Jaipur-based pharmaceutical distributor and healthcare product supplier.",
  path: "/product-portfolio",
});

export default function ProductPortfolioPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <ProductPortfolioClient products={products} />
      </div>
    </section>
  );
}
