import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getTherapeuticArea } from "@/data/productMeta";
import { products } from "@/data/products";
import { absoluteUrl, OG_IMAGE } from "@/data/seo";

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
  const title = product
    ? `${product.brandName} | Product Portfolio | Macron Health Care`
    : "Product Portfolio | Macron Health Care";
  const description = product
    ? `View ${product.brandName}, its composition, dosage form, and product visual aid in the Macron Health Care product portfolio.`
    : "View the Macron Health Care pharmaceutical product portfolio.";
  const path = product
    ? `/product-portfolio/${product.slug}`
    : "/product-portfolio";

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: "Macron Health Care",
      type: "website",
      images: [
        {
          url: absoluteUrl(product?.visualAidImage ?? OG_IMAGE),
          alt: product
            ? `${product.brandName} Macron Health Care product visual aid`
            : "Macron Health Care product portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(product?.visualAidImage ?? OG_IMAGE)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
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

  return (
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
  );
}
