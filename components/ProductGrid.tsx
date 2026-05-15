"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import {
  getProductCategory,
  getProductCategoryLabel,
  productCategories,
  productCategoryFilters,
  type ProductCategory,
  type ProductCategoryFilter,
} from "@/data/productCategories";
import ProductCard from "@/components/ProductCard";

type ProductGridProps = {
  products: Product[];
};

type CategorizedProduct = Product & {
  broadCategory: ProductCategory;
};

type ProductSection = {
  category: ProductCategory;
  products: CategorizedProduct[];
};

const sortByBrandName = (items: CategorizedProduct[]) =>
  [...items].sort((first, second) =>
    first.brandName.localeCompare(second.brandName, undefined, {
      sensitivity: "base",
    }),
  );

export default function ProductGrid({ products }: ProductGridProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryFilter>("All");

  const categorizedProducts = useMemo<CategorizedProduct[]>(
    () =>
      products.map((product) => ({
        ...product,
        broadCategory: getProductCategory(product.dosageForm),
      })),
    [products],
  );

  const filteredProducts = useMemo<CategorizedProduct[]>(() => {
    const search = query.trim().toLowerCase();
    const categoryFilteredProducts =
      selectedCategory === "All"
        ? categorizedProducts
        : categorizedProducts.filter(
            (product) => product.broadCategory === selectedCategory,
          );

    if (search) {
      return categoryFilteredProducts.filter((product) =>
        [
          product.brandName,
          product.composition,
          product.dosageForm,
          product.broadCategory,
          getProductCategoryLabel(product.broadCategory),
        ]
          .join(" ")
          .toLowerCase()
          .includes(search),
      );
    }

    return categoryFilteredProducts;
  }, [categorizedProducts, query, selectedCategory]);

  const selectedCategoryLabel = getProductCategoryLabel(selectedCategory);
  const productCountLabel =
    selectedCategory === "All"
      ? `Showing ${filteredProducts.length} ${
          filteredProducts.length === 1 ? "product" : "products"
        }`
      : `${selectedCategoryLabel} - ${filteredProducts.length} ${
          filteredProducts.length === 1 ? "product" : "products"
        }`;

  const productSections = useMemo<ProductSection[]>(() => {
    if (selectedCategory !== "All") {
      const sortedProducts = sortByBrandName(filteredProducts);

      return sortedProducts.length > 0
        ? [
            {
              category: selectedCategory,
              products: sortedProducts,
            },
          ]
        : [];
    }

    return productCategories
      .map((category) => ({
        category,
        products: sortByBrandName(
          filteredProducts.filter(
            (product) => product.broadCategory === category,
          ),
        ),
      }))
      .filter((section) => section.products.length > 0);
  }, [filteredProducts, selectedCategory]);

  return (
    <div className="space-y-8">
      <div className="rounded-[1.1rem] border border-line bg-white p-4 shadow-soft sm:p-5">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brand, composition, dosage form..."
          aria-label="Search by brand, composition, dosage form, or category"
          className="h-[52px] w-full rounded-md border border-line bg-paper px-5 text-base text-ink outline-none transition placeholder:text-slate/65 focus:border-blue focus:bg-white focus:ring-4 focus:ring-blue/10"
        />

        <div className="mt-4 space-y-3 border-t border-line pt-4">
          <p className="text-sm font-semibold text-slate">Filter by dosage form</p>

          <div className="-mx-1 overflow-x-auto px-1 pb-1">
            <div className="flex min-w-max gap-2 sm:flex-wrap">
              {productCategoryFilters.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`h-[38px] shrink-0 rounded-full border px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
                      isSelected
                        ? "border-blue bg-blue text-white shadow-soft"
                        : "border-blue/15 bg-white text-slate hover:border-blue/45 hover:text-blue"
                    }`}
                  >
                    {getProductCategoryLabel(category)}
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-sm font-semibold text-blue">{productCountLabel}</p>
        </div>
      </div>

      {productSections.length > 0 ? (
        <div className="space-y-10">
          {productSections.map((section) => (
            <section key={section.category} className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-xl font-semibold text-ink">
                  {getProductCategoryLabel(section.category)}
                </h2>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate">
                  {section.products.length}
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
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
