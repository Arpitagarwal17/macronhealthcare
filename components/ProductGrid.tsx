"use client";

import { Check, ChevronDown, Plus, Search } from "lucide-react";
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
import BasketFloatingButton from "@/components/BasketFloatingButton";
import ProductCard from "@/components/ProductCard";
import { useBasket } from "@/components/useBasket";

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
  const { addProduct, addProducts, count, hasProduct, removeProduct } = useBasket();

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

    if (!search) {
      return categoryFilteredProducts;
    }

    return categoryFilteredProducts.filter((product) =>
      [
        product.brandName,
        product.composition,
        product.dosageForm,
        product.broadCategory,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [categorizedProducts, query, selectedCategory]);

  const productSections = useMemo<ProductSection[]>(() => {
    if (selectedCategory !== "All") {
      const sortedProducts = sortByBrandName(filteredProducts);

      return sortedProducts.length
        ? [{ category: selectedCategory, products: sortedProducts }]
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

  const allVisibleSelected = filteredProducts.every((product) =>
    hasProduct(product.slug),
  );

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-line bg-white p-4 shadow-premium sm:p-5">
        <label className="relative block">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brand or composition..."
            aria-label="Search by brand or composition"
            className="h-[52px] w-full rounded-lg border border-line bg-paper pl-12 pr-5 text-base text-ink outline-none transition placeholder:text-slate/65 focus:border-blue focus:bg-white focus:ring-4 focus:ring-blue/10"
          />
        </label>

        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="block sm:hidden" htmlFor="doctor-presentation-category">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate">
              Filter by dosage form
            </span>
            <span className="relative block">
              <select
                id="doctor-presentation-category"
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value as ProductCategoryFilter)
                }
                className="h-12 w-full appearance-none rounded-lg border border-blue/20 bg-white px-4 pr-11 text-sm font-bold text-blue outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
              >
                {productCategoryFilters.map((category) => (
                  <option key={category} value={category}>
                    {getProductCategoryLabel(category)}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal"
                aria-hidden="true"
              />
            </span>
          </label>

          <div className="hidden sm:block">
            <div className="flex flex-wrap gap-2">
              {productCategoryFilters.map((category) => {
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`h-[38px] shrink-0 rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
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

          {filteredProducts.length > 0 ? (
            <button
              type="button"
              onClick={() => addProducts(filteredProducts.map((product) => product.slug))}
              disabled={allVisibleSelected}
              className="secondary-button min-h-10 shrink-0 px-4"
            >
              {allVisibleSelected ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {allVisibleSelected
                ? selectedCategory === "All"
                  ? "All products selected"
                  : "Category selected"
                : "Select all"}
            </button>
          ) : null}
        </div>
      </div>

      {productSections.length ? (
        <div className="space-y-12">
          {productSections.map((section, sectionIndex) => (
            <section key={section.category} className="space-y-5">
              <div className="border-b border-line pb-3">
                <h2 className="text-2xl font-extrabold text-ink">
                  {getProductCategoryLabel(section.category)}
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product, productIndex) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    isInBasket={hasProduct(product.slug)}
                    onAddToBasket={addProduct}
                    onRemoveFromBasket={removeProduct}
                    priority={sectionIndex === 0 && productIndex === 0}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-slate">No products found.</div>
      )}

      <BasketFloatingButton count={count} />
    </div>
  );
}
