import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { company } from "@/data/company";
import { getProductImageAlt, getTherapeuticArea } from "@/data/productMeta";
import { products } from "@/data/products";
import { absoluteUrl } from "@/data/seo";

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

  const productUrl = absoluteUrl(`/product-portfolio/${product.slug}`);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: product.brandName,
        url: productUrl,
        image: absoluteUrl(product.visualAidImage),
        description: `${product.brandName}: ${product.composition}. Dosage form: ${product.dosageForm}.`,
        brand: {
          "@type": "Brand",
          name: product.brandName,
        },
        manufacturer: {
          "@id": `${company.websiteUrl}/#organization`,
        },
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Composition",
            value: product.composition,
          },
          {
            "@type": "PropertyValue",
            name: "Dosage form",
            value: product.dosageForm,
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${productUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: company.displayName,
            item: absoluteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Product Portfolio",
            item: absoluteUrl("/product-portfolio"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.brandName,
            item: productUrl,
          },
        ],
      },
    ],
  };

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
