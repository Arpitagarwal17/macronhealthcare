import ProductPortfolioClient from "@/components/ProductPortfolioClient";
import { products } from "@/data/products";

export const metadata = {
  title: "Product Portfolio | Macron Health Care",
};

export default function ProductListPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <ProductPortfolioClient products={products} />
      </div>
    </section>
  );
}
