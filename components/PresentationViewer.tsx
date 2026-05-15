"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

type PresentationViewerProps = {
  products: Product[];
  initialIndex?: number;
  onClose: () => void;
};

export default function PresentationViewer({
  products,
  initialIndex = 0,
  onClose,
}: PresentationViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const currentProduct = products[currentIndex];

  const goToProduct = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(Math.max(index, 0), products.length - 1));
    },
    [products.length],
  );

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(index + 1, products.length - 1));
  }, [products.length]);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(Math.max(index, 0), products.length - 1));
  }, [products.length]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [goNext, goPrevious, onClose]);

  if (!currentProduct) {
    return null;
  }

  const counterText = `Product ${currentIndex + 1} of ${products.length}`;

  return (
    <div
      className="fixed inset-0 z-[80] h-[100dvh] bg-paper text-ink"
      role="dialog"
      aria-modal="true"
      aria-label="PPT view"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 shadow-soft sm:px-6">
          <span className="rounded-full border border-blue/15 bg-porcelain px-4 py-2 text-sm font-semibold text-blue">
            {counterText}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
          >
            Exit PPT View
          </button>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <section
            className="min-h-0 p-3 sm:p-5 lg:p-6"
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              if (touchStartX.current === null) {
                return;
              }

              const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
              const deltaX = touchStartX.current - touchEndX;

              if (Math.abs(deltaX) > 56) {
                if (deltaX > 0) {
                  goNext();
                } else {
                  goPrevious();
                }
              }

              touchStartX.current = null;
            }}
          >
            <article className="flex h-full min-h-0 flex-col rounded-[1.35rem] border border-line bg-white shadow-premium">
              <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 sm:p-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:gap-6 lg:overflow-hidden">
                <div className="flex min-w-0 flex-col justify-center gap-5 overflow-y-auto rounded-[1rem] border border-line bg-paper/70 p-5 sm:p-6">
                  <h1 className="break-words text-3xl font-semibold leading-tight text-ink sm:text-4xl lg:text-5xl">
                    {currentProduct.brandName}
                  </h1>

                  <div className="space-y-2 border-t border-line pt-5">
                    <p className="field-label">Composition</p>
                    <p className="break-words text-lg leading-8 text-ink [overflow-wrap:anywhere] sm:text-xl">
                      {currentProduct.composition}
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-line pt-5">
                    <p className="field-label">Dosage Form</p>
                    <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-4 py-2 text-base font-semibold leading-6 text-blue">
                      {currentProduct.dosageForm}
                    </span>
                  </div>
                </div>

                <div className="relative min-h-[300px] min-w-0 overflow-hidden rounded-[1rem] border border-line bg-white sm:min-h-[420px] lg:min-h-0">
                  <Image
                    src={currentProduct.visualAidImage}
                    alt={currentProduct.brandName}
                    fill
                    priority
                    sizes="(min-width: 1024px) 70vw, 100vw"
                    className="object-contain p-3 sm:p-5"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-line bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Previous
                </button>
                <span className="text-center text-sm font-semibold text-blue">
                  {counterText}
                </span>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentIndex === products.length - 1}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  Next
                </button>
              </div>
            </article>
          </section>

          <aside className="hidden min-h-0 border-l border-line bg-white p-4 lg:block">
            <p className="field-label text-blue">Product List</p>
            <div className="mt-4 flex max-h-[calc(100dvh-7rem)] flex-col gap-2 overflow-y-auto pr-1">
              {products.map((product, index) => {
                const isActive = index === currentIndex;

                return (
                  <button
                    key={product.slug}
                    type="button"
                    onClick={() => goToProduct(index)}
                    className={`rounded-md border px-3 py-2 text-left text-sm font-semibold leading-5 transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
                      isActive
                        ? "border-blue bg-blue text-white shadow-soft"
                        : "border-line bg-paper text-ink hover:border-blue hover:bg-white hover:text-blue"
                    }`}
                  >
                    <span className="mr-2 text-xs opacity-75">{index + 1}</span>
                    {product.brandName}
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
