"use client";

import { useEffect, useRef } from "react";
import { productCardId } from "@/lib/productNavigation";

/** The filtered cards may mount after Next.js first attempts hash scrolling. */
export function useCatalogCardAnchor(slug: string) {
  const ref = useRef<HTMLElement>(null);
  const id = productCardId(slug);

  useEffect(() => {
    if (window.location.hash !== `#${id}`) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        if (window.location.hash === `#${id}`) {
          ref.current?.scrollIntoView({ block: "start", behavior: "instant" });
        }
      });
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [id]);

  return { ref, id };
}
