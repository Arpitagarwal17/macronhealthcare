import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { getProductImageAlt, getTherapeuticArea } from "@/data/productMeta";
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

  const description =
    `${product.brandName} visual aid for healthcare professionals from ` +
    "Macron Health Care.";
  const path = `/doctor-presentation/${product.slug}`;

  return {
    title: `${product.brandName} | Doctor Presentation`,
    description,
    alternates: {
      canonical: `/product-portfolio/${product.slug}`,
    },
    openGraph: {
      title: `${product.brandName} | Macron Health Care`,
      description,
      url: path,
      siteName: "Macron Health Care",
      type: "website",
      images: [
        {
          url: product.visualAidImage,
          width: product.visualAidWidth ?? 1672,
          height: product.visualAidHeight ?? 941,
          type: product.visualAidImage.endsWith(".jpg")
            ? "image/jpeg"
            : "image/png",
          alt: getProductImageAlt(product),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.brandName} | Macron Health Care`,
      description,
      images: [product.visualAidImage],
    },
  };
}

export default async function DoctorPresentationDetailPage({
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
      routeBase="/doctor-presentation"
      backLabel="All Visual Aids"
      showBasketAction
    />
  );
}
