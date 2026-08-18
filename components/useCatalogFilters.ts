"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  productCategoryFilters,
  type ProductCategoryFilter,
} from "@/data/productCategories";
import { therapeuticAreas, type TherapeuticArea } from "@/data/productMeta";

export type TherapeuticFilter = "All" | TherapeuticArea;
export type CatalogFilterKey = "category" | "therapeutic" | "q";

export function useCatalogFilters() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const serializedSearchParams = searchParams.toString();
  const categoryParam = searchParams.get("category");
  const therapeuticParam = searchParams.get("therapeutic");
  const query = searchParams.get("q") ?? "";
  const selectedCategory =
    categoryParam &&
    productCategoryFilters.includes(categoryParam as ProductCategoryFilter)
      ? (categoryParam as ProductCategoryFilter)
      : "All";
  const selectedTherapeuticArea: TherapeuticFilter =
    therapeuticParam &&
    therapeuticAreas.includes(therapeuticParam as TherapeuticArea)
      ? (therapeuticParam as TherapeuticArea)
      : "All";

  const replaceFilter = useCallback(
    (key: CatalogFilterKey, value: string) => {
      const params = new URLSearchParams(serializedSearchParams);

      if (!value || value === "All") {
        params.delete(key);
      } else {
        params.set(key, value);
      }

      const nextSearch = params.toString();
      router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, serializedSearchParams],
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(serializedSearchParams);
    params.delete("category");
    params.delete("therapeutic");
    params.delete("q");

    const nextSearch = params.toString();
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
      scroll: false,
    });
  }, [pathname, router, serializedSearchParams]);

  return {
    query,
    selectedCategory,
    selectedTherapeuticArea,
    replaceFilter,
    resetFilters,
  };
}
