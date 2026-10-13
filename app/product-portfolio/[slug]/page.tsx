import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getTherapeuticArea } from "@/data/productMeta";
import { products } from "@/data/products";
import { getProductMetadata, getProductStructuredData } from "@/lib/productSeo";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return getProductMetadata(product);
}

export default async function ProductPortfolioDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const productIndex = products.findIndex((item) => item.slug === slug);
  const product = products[productIndex];

  if (!product) {
    notFound();
  }

  const therapeuticArea = getTherapeuticArea(product);
  const relatedProducts = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        getTherapeuticArea(item) === therapeuticArea,
    )
    .sort((first, second) => first.brandName.localeCompare(second.brandName))
    .slice(0, 4);

  const structuredData = getProductStructuredData(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ProductDetailView
        product={product}
        previousProduct={productIndex > 0 ? products[productIndex - 1] : null}
        nextProduct={
          productIndex < products.length - 1 ? products[productIndex + 1] : null
        }
        relatedProducts={relatedProducts}
        routeBase="/product-portfolio"
        backLabel="Product Portfolio"
        showBasketAction={false}
      />
    </>
  );
}
