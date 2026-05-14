"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

type ProductGridProps = {
  products: Product[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return products;
    }

    return products.filter((product) =>
      product.brandName.toLowerCase().includes(search),
    );
  }, [products, query]);

  return (
    <div className="space-y-6">
      <div className="max-w-xl">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brand name"
          aria-label="Search by brand name"
          className="h-14 w-full rounded-md border border-line bg-white px-5 text-base text-ink shadow-soft outline-none transition placeholder:text-slate/65 focus:border-blue focus:ring-4 focus:ring-blue/10"
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.1rem] border border-line bg-white p-8 text-slate shadow-soft">
          No brands found.
        </div>
      )}
    </div>
  );
}
