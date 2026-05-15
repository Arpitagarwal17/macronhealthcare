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

  const counterText = `${currentIndex + 1} / ${products.length}`;

  return (
    <div
      className="fixed inset-0 z-[80] h-[100dvh] bg-white text-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Doctor presentation view"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 py-2 sm:px-6">
          <Image
            src="/logo.png"
            alt="Macron Health Care"
            width={210}
            height={85}
            unoptimized
            className="h-11 w-auto max-w-[170px] object-contain sm:h-14 sm:max-w-[220px]"
          />
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue/15 bg-porcelain px-3 py-1.5 text-sm font-semibold text-blue">
              {counterText}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-white px-4 text-sm font-semibold text-ink transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
            >
              Exit
            </button>
          </div>
        </header>

        <main
          className="flex min-h-0 flex-1 flex-col gap-3 p-2 sm:p-4"
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
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1rem] border border-line bg-white">
            <Image
              src={currentProduct.visualAidImage}
              alt={currentProduct.brandName}
              fill
              priority
              sizes="100vw"
              className="object-contain p-1 sm:p-2"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
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
        </main>
      </div>
    </div>
  );
}
