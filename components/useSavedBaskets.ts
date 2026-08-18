"use client";

import { useCallback, useEffect, useState } from "react";

const SAVED_BASKETS_KEY = "macron-saved-presentation-baskets";
const SAVED_BASKETS_EVENT = "macron-saved-presentation-baskets-change";

export type SavedBaskets = Record<string, string[]>;

function normalizeSavedBaskets(value: unknown): SavedBaskets {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(
        (entry): entry is [string, string[]] =>
          entry[0].trim().length > 0 && Array.isArray(entry[1]),
      )
      .map(([name, slugs]) => [
        name.trim(),
        [...new Set(slugs.filter((slug) => typeof slug === "string" && slug))],
      ])
      .filter(([, slugs]) => slugs.length > 0),
  );
}

function readSavedBaskets(): SavedBaskets {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const rawValue = window.localStorage.getItem(SAVED_BASKETS_KEY);
    return rawValue ? normalizeSavedBaskets(JSON.parse(rawValue)) : {};
  } catch {
    return {};
  }
}

function writeSavedBaskets(savedBaskets: SavedBaskets) {
  window.localStorage.setItem(
    SAVED_BASKETS_KEY,
    JSON.stringify(savedBaskets),
  );
  window.dispatchEvent(new Event(SAVED_BASKETS_EVENT));
}

export function useSavedBaskets() {
  const [savedBaskets, setSavedBaskets] = useState<SavedBaskets>({});
  const [isReady, setIsReady] = useState(false);

  const sync = useCallback(() => {
    setSavedBaskets(readSavedBaskets());
  }, []);

  useEffect(() => {
    sync();
    setIsReady(true);

    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === SAVED_BASKETS_KEY) {
        sync();
      }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener(SAVED_BASKETS_EVENT, sync);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(SAVED_BASKETS_EVENT, sync);
    };
  }, [sync]);

  const saveBasket = useCallback((name: string, slugs: string[]) => {
    const normalizedName = name.trim();
    const normalizedSlugs = [...new Set(slugs.filter(Boolean))];
    if (!normalizedName || normalizedSlugs.length === 0) {
      return;
    }

    const next = {
      ...readSavedBaskets(),
      [normalizedName]: normalizedSlugs,
    };
    writeSavedBaskets(next);
    setSavedBaskets(next);
  }, []);

  const deleteBasket = useCallback((name: string) => {
    const next = { ...readSavedBaskets() };
    delete next[name];
    writeSavedBaskets(next);
    setSavedBaskets(next);
  }, []);

  return { savedBaskets, isReady, saveBasket, deleteBasket };
}
