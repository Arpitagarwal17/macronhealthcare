"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ProductGrid from "@/components/ProductGrid";
import ProductPortfolioClient from "@/components/ProductPortfolioClient";
import type { Product } from "@/data/products";

type CatalogProps = {
  products: Product[];
};

function ResolvedProductPortfolio({ products }: CatalogProps) {
  const searchParams = useSearchParams();

  return (
    <ProductPortfolioClient
      products={products}
      serializedSearchParams={searchParams.toString()}
    />
  );
}

function ResolvedVisualAidPortfolio({ products }: CatalogProps) {
  const searchParams = useSearchParams();

  return (
    <ProductGrid
      products={products}
      serializedSearchParams={searchParams.toString()}
    />
  );
}

// Static HTML includes the complete catalogue. URL filters take over after
// hydration, without making these listing pages depend on request-time rendering.
export function ProductPortfolioCatalog({ products }: CatalogProps) {
  return (
    <Suspense fallback={<ProductPortfolioClient products={products} />}>
      <ResolvedProductPortfolio products={products} />
    </Suspense>
  );
}

export function VisualAidPortfolioCatalog({ products }: CatalogProps) {
  return (
    <Suspense fallback={<ProductGrid products={products} />}>
      <ResolvedVisualAidPortfolio products={products} />
    </Suspense>
  );
}
