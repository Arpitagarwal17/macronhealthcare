"use client";

import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function ZoomableVisualAid({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-line bg-white shadow-premium focus:outline-none focus:ring-4 focus:ring-blue/15"
        aria-label="Open visual aid full screen"
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 68vw, 100vw"
          className="object-contain p-2 sm:p-3"
        />
        <span className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-white/95 text-blue shadow-soft transition group-hover:border-blue">
          <Maximize2 className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-white p-2 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen visual aid"
        >
          <button
            type="button"
            aria-label="Close full-screen visual aid"
            onClick={() => setIsOpen(false)}
            className="icon-button absolute right-4 top-4 z-10"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="relative h-[calc(100dvh-1rem)] w-[calc(100vw-1rem)] sm:h-[calc(100dvh-2rem)] sm:w-[calc(100vw-2rem)]">
            <Image src={src} alt={alt} fill priority sizes="100vw" className="object-contain" />
          </div>
        </div>
      ) : null}
    </>
  );
}
