import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getTherapeuticArea } from "@/data/productMeta";
import { products } from "@/data/products";

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

  const fullDescription =
    `${product.brandName} - ${product.composition}. ${product.dosageForm} by ` +
    "Macron Health Care. View composition, dosage form and product visual aid.";
  const description =
    fullDescription.length > 158
      ? `${fullDescription.slice(0, 155)}...`
      : fullDescription;
  const path = `/product-portfolio/${product.slug}`;
  const socialDescription =
    `${product.brandName} (${product.dosageForm}) - composition and product visual aid ` +
    "from Macron Health Care.";

  return {
    title: `${product.brandName} | Product Portfolio`,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${product.brandName} | Macron Health Care`,
      description: socialDescription,
      url: path,
      siteName: "Macron Health Care",
      type: "website",
      images: [
        {
          url: product.visualAidImage,
          alt: `${product.brandName} Macron Health Care product visual aid`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.brandName} | Macron Health Care`,
      description: socialDescription,
      images: [product.visualAidImage],
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
