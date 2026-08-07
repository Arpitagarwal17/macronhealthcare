import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Package } from "lucide-react";
import ProductDetailActions from "@/components/ProductDetailActions";
import ZoomableVisualAid from "@/components/ZoomableVisualAid";
import { getProductPackSize, splitComposition } from "@/data/productMeta";
import type { Product } from "@/data/products";

type ProductDetailViewProps = {
  product: Product;
  previousProduct: Product | null;
  nextProduct: Product | null;
  relatedProducts: Product[];
  routeBase: "/product-portfolio" | "/doctor-presentation";
  backLabel: string;
  showBasketAction: boolean;
};

export default function ProductDetailView({
  product,
  previousProduct,
  nextProduct,
  relatedProducts,
  routeBase,
  backLabel,
  showBasketAction,
}: ProductDetailViewProps) {
  const ingredients = splitComposition(product.composition);

  return (
    <section className="page-shell py-8 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href={routeBase} className="secondary-button min-h-10 px-4">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
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

            <ProductDetailActions
              product={product}
              showBasketAction={showBasketAction}
            />
          </div>
        </aside>
      </div>

      <nav
        className="mt-6 grid gap-3 sm:grid-cols-2"
        aria-label="Previous and next products"
      >
        {previousProduct ? (
          <Link
            href={`${routeBase}/${previousProduct.slug}`}
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
            href={`${routeBase}/${nextProduct.slug}`}
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
              <p className="field-label text-teal">Same therapeutic area</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">Related products</h2>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item.slug}
                href={`${routeBase}/${item.slug}`}
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
