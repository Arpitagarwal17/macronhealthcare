"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type FullScreenImageViewerProps = {
  src: string;
  alt: string;
};

export default function FullScreenImageViewer({
  src,
  alt,
}: FullScreenImageViewerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button type="button" className="primary-button" onClick={() => setIsOpen(true)}>
        View Full Screen
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white p-4">
          <button
            type="button"
            aria-label="Close full-screen visual aid"
            onClick={() => setIsOpen(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white text-base font-semibold text-ink shadow-soft transition hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
          >
            X
          </button>
          <div className="relative h-[calc(100vh-2rem)] w-[calc(100vw-2rem)]">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              priority
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
