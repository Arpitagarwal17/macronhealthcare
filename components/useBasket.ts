"use client";

import { useCallback, useEffect, useState } from "react";

const BASKET_KEY = "macron-presentation-basket";
const BASKET_EVENT = "macron-presentation-basket-change";

type BasketUpdate = string[] | ((currentSlugs: string[]) => string[]);

function normalizeSlugs(slugs: string[]) {
  return Array.from(
    new Set(slugs.filter((slug) => typeof slug === "string" && slug.trim())),
  );
}

function readBasketSlugs() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedBasket = window.localStorage.getItem(BASKET_KEY);

    if (!storedBasket) {
      return [];
    }

    const parsedBasket: unknown = JSON.parse(storedBasket);

    if (!Array.isArray(parsedBasket)) {
      return [];
    }

    return normalizeSlugs(parsedBasket as string[]);
  } catch {
    return [];
  }
}

function writeBasketSlugs(slugs: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(BASKET_KEY, JSON.stringify(slugs));
  window.dispatchEvent(new Event(BASKET_EVENT));
}

export function useBasket() {
  const [basketSlugs, setBasketSlugs] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);

  const syncBasket = useCallback(() => {
    setBasketSlugs(readBasketSlugs());
  }, []);

  useEffect(() => {
    syncBasket();
    setIsReady(true);

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === BASKET_KEY) {
        syncBasket();
      }
    };

    const onBasketChange = () => {
      syncBasket();
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(BASKET_EVENT, onBasketChange);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(BASKET_EVENT, onBasketChange);
    };
  }, [syncBasket]);

  const commitBasket = useCallback((update: BasketUpdate) => {
    const currentSlugs = readBasketSlugs();
    const nextSlugs =
      typeof update === "function" ? update(currentSlugs) : update;
    const normalizedSlugs = normalizeSlugs(nextSlugs);

    writeBasketSlugs(normalizedSlugs);
    setBasketSlugs(normalizedSlugs);
  }, []);

  const addProduct = useCallback(
    (slug: string) => {
      commitBasket((currentSlugs) =>
        currentSlugs.includes(slug) ? currentSlugs : [...currentSlugs, slug],
      );
    },
    [commitBasket],
  );

  const removeProduct = useCallback(
    (slug: string) => {
      commitBasket((currentSlugs) =>
        currentSlugs.filter((currentSlug) => currentSlug !== slug),
      );
    },
    [commitBasket],
  );

  const clearBasket = useCallback(() => {
    commitBasket([]);
  }, [commitBasket]);

  const replaceBasket = useCallback(
    (slugs: string[]) => {
      commitBasket(slugs);
    },
    [commitBasket],
  );

  const moveProduct = useCallback(
    (slug: string, direction: -1 | 1) => {
      commitBasket((currentSlugs) => {
        const currentIndex = currentSlugs.indexOf(slug);
        const nextIndex = currentIndex + direction;

        if (
          currentIndex < 0 ||
          nextIndex < 0 ||
          nextIndex >= currentSlugs.length
        ) {
          return currentSlugs;
        }

        const nextSlugs = [...currentSlugs];
        [nextSlugs[currentIndex], nextSlugs[nextIndex]] = [
          nextSlugs[nextIndex],
          nextSlugs[currentIndex],
        ];

        return nextSlugs;
      });
    },
    [commitBasket],
  );

  const hasProduct = useCallback(
    (slug: string) => basketSlugs.includes(slug),
    [basketSlugs],
  );

  return {
    slugs: basketSlugs,
    count: basketSlugs.length,
    isReady,
    addProduct,
    removeProduct,
    clearBasket,
    replaceBasket,
    moveProduct,
    hasProduct,
  };
}
