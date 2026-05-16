import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FullScreenImageViewer from "@/components/FullScreenImageViewer";
import VisualAidImage from "@/components/VisualAidImage";
import { products } from "@/data/products";
import { absoluteUrl, OG_IMAGE } from "@/data/seo";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
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
            : "Macron Health Care logo",
        },
      ],
    },
  };
}

export default async function DoctorPresentationDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="page-shell py-8 sm:py-12">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="premium-panel h-fit min-w-0 p-6 sm:p-7">
          <div className="space-y-6">
            <h1 className="text-3xl font-semibold leading-tight text-ink">
              {product.brandName}
            </h1>

            <div className="space-y-2 border-t border-line pt-5">
              <p className="field-label">Composition</p>
              <p className="break-words text-base leading-7 text-ink [overflow-wrap:anywhere]">
                {product.composition}
              </p>
            </div>

            <div className="space-y-2 border-t border-line pt-5">
              <p className="field-label">Dosage Form</p>
              <p className="break-words text-base leading-7 text-ink [overflow-wrap:anywhere]">
                {product.dosageForm}
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-line pt-5 sm:flex-row lg:flex-col">
              <FullScreenImageViewer
                src={product.visualAidImage}
                alt={`${product.brandName} Macron Health Care product visual aid`}
              />
              <Link href="/doctor-presentation" className="secondary-button">
                Back to Doctor Presentation
              </Link>
            </div>
          </div>
        </aside>

        <VisualAidImage
          src={product.visualAidImage}
          alt={`${product.brandName} Macron Health Care product visual aid`}
          priority
          className="aspect-[16/9] rounded-[1.35rem] border border-line shadow-premium sm:aspect-auto sm:min-h-[720px]"
          imageClassName="p-3 sm:p-5"
          sizes="(min-width: 1024px) 76vw, 100vw"
        />
      </div>
    </section>
  );
}
