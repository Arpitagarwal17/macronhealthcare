"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { getProductImageAlt } from "@/data/productMeta";

type PresentationViewerProps = {
  products: Product[];
  initialIndex?: number;
  onClose: () => void;
};

type WakeLockHandle = {
  release: () => Promise<void>;
};

type WakeLockNavigator = Navigator & {
  wakeLock?: {
    request: (type: "screen") => Promise<WakeLockHandle>;
  };
};

const FOCUSABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export default function PresentationViewer({
  products,
  initialIndex = 0,
  onClose,
}: PresentationViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
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
    const previouslyFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const dialog = dialogRef.current;
    let disposed = false;
    let ownsFullscreen = false;
    let wakeLock: WakeLockHandle | null = null;

    const requestWakeLock = async () => {
      const wakeLockApi = (navigator as WakeLockNavigator).wakeLock;

      if (!wakeLockApi || document.visibilityState !== "visible" || wakeLock) {
        return;
      }

      try {
        const nextWakeLock = await wakeLockApi.request("screen");

        if (disposed) {
          await nextWakeLock.release().catch(() => undefined);
          return;
        }

        wakeLock = nextWakeLock;
      } catch {
        // Wake Lock is an enhancement; presentation controls remain usable.
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        wakeLock = null;
        void requestWakeLock();
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (dialog && !dialog.contains(event.target as Node)) {
        closeButtonRef.current?.focus({ preventScroll: true });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab" && dialog) {
        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements.at(-1);

        if (!firstElement || !lastElement) {
          event.preventDefault();
          dialog.focus();
          return;
        }

        if (
          event.shiftKey &&
          (document.activeElement === firstElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          lastElement.focus();
          return;
        }

        if (
          !event.shiftKey &&
          (document.activeElement === lastElement ||
            !dialog.contains(document.activeElement))
        ) {
          event.preventDefault();
          firstElement.focus();
          return;
        }
      }

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
    const focusFrame = window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus({ preventScroll: true });
    });

    if (dialog?.requestFullscreen && !document.fullscreenElement) {
      void dialog
        .requestFullscreen()
        .then(() => {
          if (disposed) {
            if (document.fullscreenElement === dialog) {
              void document.exitFullscreen().catch(() => undefined);
            }
            return;
          }

          ownsFullscreen = true;
        })
        .catch(() => undefined);
    }

    void requestWakeLock();
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      disposed = true;
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("focusin", onFocusIn);
      void wakeLock?.release().catch(() => undefined);

      if (ownsFullscreen && document.fullscreenElement === dialog) {
        void document.exitFullscreen().catch(() => undefined);
      }

      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [goNext, goPrevious, onClose]);

  if (!currentProduct) {
    return null;
  }

  const counterText = `${currentIndex + 1} / ${products.length}`;
  const adjacentProducts = [
    products[currentIndex - 1],
    products[currentIndex + 1],
  ].filter((product): product is Product => Boolean(product));

  const resetTouch = () => {
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-[80] h-[100dvh] bg-white text-ink"
      role="dialog"
      aria-modal="true"
      aria-label="Doctor presentation view"
    >
      <div className="flex h-full min-h-0 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-white px-4 pb-2 pt-[calc(0.5rem+env(safe-area-inset-top))] sm:px-6">
          <Image
            src="/logo.png"
            alt="Macron Health Care logo"
            width={210}
            height={85}
            sizes="220px"
            className="h-11 w-auto max-w-[170px] object-contain sm:h-14 sm:max-w-[220px]"
          />
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-blue/15 bg-porcelain px-3 py-1.5 text-sm font-bold text-blue">
              Product {currentIndex + 1} of {products.length}
            </span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 text-sm font-bold text-ink transition hover:border-blue hover:text-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Exit
            </button>
          </div>
        </header>

        <main
          className="flex min-h-0 flex-1 flex-col gap-3 p-2 sm:p-4"
          onTouchStart={(event) => {
            if (event.touches.length !== 1) {
              resetTouch();
              return;
            }

            touchStartX.current = event.touches[0]?.clientX ?? null;
            touchStartY.current = event.touches[0]?.clientY ?? null;
          }}
          onTouchMove={(event) => {
            if (event.touches.length > 1) {
              resetTouch();
            }
          }}
          onTouchEnd={(event) => {
            if (
              touchStartX.current === null ||
              touchStartY.current === null ||
              event.changedTouches.length !== 1 ||
              event.touches.length !== 0
            ) {
              resetTouch();
              return;
            }

            const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
            const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current;
            const deltaX = touchStartX.current - touchEndX;
            const deltaY = touchStartY.current - touchEndY;

            if (Math.abs(deltaX) > 56 && Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX > 0) {
                goNext();
              } else {
                goPrevious();
              }
            }

            resetTouch();
          }}
          onTouchCancel={resetTouch}
        >
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1rem] border border-line bg-white">
            <Image
              src={currentProduct.visualAidImage}
              alt={getProductImageAlt(currentProduct)}
              fill
              priority
              sizes="100vw"
              className="object-contain p-1 sm:p-2"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
            >
              {adjacentProducts.map((product) => (
                <div key={product.slug} className="relative h-px w-px">
                  <Image
                    src={product.visualAidImage}
                    alt=""
                    fill
                    loading="eager"
                    sizes="100vw"
                    className="object-contain p-1 sm:p-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="secondary-button min-h-11"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Previous
            </button>
            <span
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="text-center text-sm font-semibold text-blue"
            >
              {counterText}
            </span>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === products.length - 1}
              className="primary-button min-h-11"
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
