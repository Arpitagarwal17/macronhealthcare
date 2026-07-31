import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import { notFound } from "next/navigation";
import ProductDetailActions from "@/components/ProductDetailActions";
import ZoomableVisualAid from "@/components/ZoomableVisualAid";
import { getProductCategory } from "@/data/productCategories";
import {
  getProductPackSize,
  splitComposition,
} from "@/data/productMeta";
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

  return {
    title: product
      ? `${product.brandName} | Macron Health Care`
      : "Doctor Presentation | Macron Health Care",
    description: product
      ? `${product.brandName} product visual aid from Macron Health Care. View brand name, composition, dosage form, and visual aid image.`
      : "Create and view professional product presentations from Macron Health Care for healthcare professionals and doctors.",
    alternates: {
      canonical: product
        ? absoluteUrl(`/doctor-presentation/${product.slug}`)
        : absoluteUrl("/doctor-presentation"),
    },
    openGraph: {
      title: product
        ? `${product.brandName} | Macron Health Care`
        : "Doctor Presentation | Macron Health Care",
      description: product
        ? `${product.brandName} product visual aid from Macron Health Care.`
        : "Professional product presentations from Macron Health Care.",
      url: product
        ? absoluteUrl(`/doctor-presentation/${product.slug}`)
        : absoluteUrl("/doctor-presentation"),
      siteName: "Macron Health Care",
      type: "website",
      images: [
        {
          url: absoluteUrl(product?.visualAidImage ?? OG_IMAGE),
          alt: product
            ? `${product.brandName} Macron Health Care product visual aid`
            : "Macron Health Care",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product
        ? `${product.brandName} | Macron Health Care`
        : "Doctor Presentation | Macron Health Care",
      description: product
        ? `${product.brandName} product visual aid from Macron Health Care.`
        : "Professional product presentations from Macron Health Care.",
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

export default async function DoctorPresentationDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const productIndex = products.findIndex((item) => item.slug === slug);
  const product = products[productIndex];

  if (!product) {
    notFound();
  }

  const previousProduct = productIndex > 0 ? products[productIndex - 1] : null;
  const nextProduct =
    productIndex < products.length - 1 ? products[productIndex + 1] : null;
  const category = getProductCategory(product.dosageForm);
  const relatedProducts = products
    .filter(
      (item) =>
        item.slug !== product.slug &&
        getProductCategory(item.dosageForm) === category,
    )
    .slice(0, 4);
  const ingredients = splitComposition(product.composition);

  return (
    <section className="page-shell py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/doctor-presentation" className="secondary-button min-h-10 px-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All Visual Aids
        </Link>
        <p className="text-sm font-semibold text-slate">
          Products intended for trade and healthcare professionals.
        </p>
      </div>

      <div className="grid min-w-0 gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:items-start">
        <ZoomableVisualAid
          src={product.visualAidImage}
          alt={`${product.brandName} Macron Health Care product visual aid`}
        />

        <aside className="premium-panel min-w-0 p-6 sm:p-7">
          <div className="space-y-6">
            <div>
              <span className="inline-flex rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-bold text-blue">
                {product.dosageForm}
              </span>
              <h1 className="mt-3 text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
                {product.brandName}
              </h1>
            </div>

            <div className="border-t border-line pt-5">
              <p className="field-label">Composition</p>
              <ul className="mt-3 space-y-2.5">
                {ingredients.map((ingredient) => (
                  <li
                    key={ingredient}
                    className="flex gap-3 break-words text-[15px] leading-6 text-ink [overflow-wrap:anywhere]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 border-y border-line py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-porcelain text-blue">
                <Package className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="field-label">Packing</p>
                <p className="mt-1 font-bold text-ink">{getProductPackSize(product)}</p>
              </div>
            </div>

            <ProductDetailActions product={product} />
          </div>
        </aside>
      </div>

      <nav
        className="mt-6 grid gap-3 sm:grid-cols-2"
        aria-label="Previous and next products"
      >
        {previousProduct ? (
          <Link
            href={`/doctor-presentation/${previousProduct.slug}`}
            className="surface-card flex min-h-16 items-center gap-3 p-4 text-sm font-bold text-blue transition hover:border-blue/35"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>
              <span className="block text-xs font-semibold text-slate">Previous</span>
              {previousProduct.brandName}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {nextProduct ? (
          <Link
            href={`/doctor-presentation/${nextProduct.slug}`}
            className="surface-card flex min-h-16 items-center justify-end gap-3 p-4 text-right text-sm font-bold text-blue transition hover:border-blue/35"
          >
            <span>
              <span className="block text-xs font-semibold text-slate">Next</span>
              {nextProduct.brandName}
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </nav>

      {relatedProducts.length ? (
        <section className="mt-14">
          <div className="flex items-end justify-between gap-4 border-b border-line pb-3">
            <div>
              <p className="field-label text-teal">Same dosage category</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">Related products</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`/doctor-presentation/${item.slug}`}
                className="group surface-card overflow-hidden transition hover:-translate-y-1 hover:border-blue/30 hover:shadow-premium"
              >
                <div className="relative aspect-[16/9] border-b border-line bg-white">
                  <Image
                    src={item.visualAidImage}
                    alt={`${item.brandName} Macron Health Care product visual aid`}
                    fill
                    sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, calc(100vw - 40px)"
                    className="object-contain p-2"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-heading text-lg font-extrabold text-ink group-hover:text-blue">
                    {item.brandName}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-slate">{item.dosageForm}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
