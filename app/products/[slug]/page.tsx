import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FullScreenImageViewer from "@/components/FullScreenImageViewer";
import VisualAidImage from "@/components/VisualAidImage";
import { products } from "@/data/products";

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
    title: product ? `${product.brandName} | Macron Health Care` : "Product | Macron Health Care",
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="page-shell py-8 sm:py-12">
      <div className="grid min-w-0 gap-8 lg:grid-cols-[380px_minmax(0,1fr)]">
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
                alt={product.brandName}
              />
              <Link href="/products" className="secondary-button">
                Back to Brands
              </Link>
            </div>
          </div>
        </aside>

        <FullScreenImageViewer
          src={product.visualAidImage}
          alt={product.brandName}
          triggerClassName="block cursor-zoom-in rounded-[1.35rem] focus:outline-none focus:ring-4 focus:ring-blue/10"
        >
          <VisualAidImage
            src={product.visualAidImage}
            alt={product.brandName}
            priority
            className="aspect-[16/9] rounded-[1.35rem] border border-line shadow-premium sm:aspect-auto sm:min-h-[680px]"
            imageClassName="p-4 sm:p-6"
            sizes="(min-width: 1024px) 70vw, 100vw"
          />
        </FullScreenImageViewer>
      </div>
    </section>
  );
}
