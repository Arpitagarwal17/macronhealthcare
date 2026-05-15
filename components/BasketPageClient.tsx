"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import PresentationViewer from "@/components/PresentationViewer";
import { useBasket } from "@/components/useBasket";

type BasketPageClientProps = {
  products: Product[];
};

export default function BasketPageClient({ products }: BasketPageClientProps) {
  const {
    slugs,
    count,
    isReady,
    removeProduct,
    clearBasket,
    replaceBasket,
    moveProduct,
  } = useBasket();
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);

  const productBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );

  const selectedProducts = useMemo(
    () =>
      slugs
        .map((slug) => productBySlug.get(slug))
        .filter((product): product is Product => Boolean(product)),
    [productBySlug, slugs],
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const validSlugs = slugs.filter((slug) => productBySlug.has(slug));

    if (validSlugs.length !== slugs.length) {
      replaceBasket(validSlugs);
    }
  }, [isReady, productBySlug, replaceBasket, slugs]);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setIsPresentationOpen(false);
    }
  }, [selectedProducts.length]);

  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="field-label text-blue">Basket</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Presentation Basket
            </h1>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/products" className="secondary-button">
              Back to Brands
            </Link>
            <button
              type="button"
              onClick={clearBasket}
              disabled={count === 0}
              className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-white px-6 text-sm font-semibold text-ink shadow-soft transition duration-200 hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
            >
              Clear Basket
            </button>
            <button
              type="button"
              onClick={() => setIsPresentationOpen(true)}
              disabled={selectedProducts.length === 0}
              className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
            >
              Start PPT View
            </button>
          </div>
        </div>

        {selectedProducts.length > 0 ? (
          <div className="space-y-4">
            {selectedProducts.map((product, index) => (
              <article
                key={product.slug}
                className="grid gap-4 rounded-[1.1rem] border border-line bg-white p-4 shadow-soft sm:grid-cols-[150px_minmax(0,1fr)_180px] sm:items-center"
              >
                <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[0.85rem] border border-line bg-white">
                  <Image
                    src={product.visualAidImage}
                    alt={product.brandName}
                    fill
                    sizes="150px"
                    className="object-contain p-2"
                  />
                </div>

                <div className="min-w-0 space-y-3">
                  <h2 className="break-words text-2xl font-semibold leading-tight text-ink">
                    {product.brandName}
                  </h2>
                  <div className="space-y-1">
                    <p className="field-label">Composition</p>
                    <p className="break-words text-[15px] leading-7 text-slate [overflow-wrap:anywhere]">
                      {product.composition}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="field-label">Dosage Form</p>
                    <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold leading-5 text-blue">
                      {product.dosageForm}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2 sm:justify-items-stretch">
                  <button
                    type="button"
                    onClick={() => moveProduct(product.slug, -1)}
                    disabled={index === 0}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Move Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveProduct(product.slug, 1)}
                    disabled={index === selectedProducts.length - 1}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Move Down
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProduct(product.slug)}
                    className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-paper px-4 text-sm font-semibold text-slate transition hover:border-blue hover:bg-white hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.1rem] border border-line bg-white p-8 text-center shadow-soft">
            <p className="text-lg font-semibold text-ink">Basket is empty.</p>
            <Link href="/products" className="primary-button mt-5">
              Add Products
            </Link>
          </div>
        )}
      </div>

      {isPresentationOpen ? (
        <PresentationViewer
          products={selectedProducts}
          onClose={() => setIsPresentationOpen(false)}
        />
      ) : null}
    </section>
  );
}
