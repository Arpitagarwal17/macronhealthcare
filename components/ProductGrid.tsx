"use client";

import { Check, Plus } from "lucide-react";
import { useMemo } from "react";
import CatalogFilters from "@/components/CatalogFilters";
import type { Product } from "@/data/products";
import {
  getProductCategory,
  getProductCategoryLabel,
  productCategories,
  type ProductCategory,
} from "@/data/productCategories";
import { getTherapeuticArea, type TherapeuticArea } from "@/data/productMeta";
import BasketFloatingButton from "@/components/BasketFloatingButton";
import ProductCard from "@/components/ProductCard";
import { useBasket } from "@/components/useBasket";
import { useCatalogFilters } from "@/components/useCatalogFilters";

type ProductGridProps = {
  products: Product[];
};

type CategorizedProduct = Product & {
  broadCategory: ProductCategory;
  therapeuticArea: TherapeuticArea;
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
  const {
    query,
    selectedCategory,
    selectedTherapeuticArea,
    replaceFilter,
    resetFilters,
  } = useCatalogFilters();
  const { addProduct, addProducts, count, hasProduct, removeProduct } = useBasket();

  const categorizedProducts = useMemo<CategorizedProduct[]>(
    () =>
      products.map((product) => ({
        ...product,
        broadCategory: getProductCategory(product.dosageForm),
        therapeuticArea: getTherapeuticArea(product),
      })),
    [products],
  );

  const filteredProducts = useMemo<CategorizedProduct[]>(() => {
    const search = query.trim().toLowerCase();
    return categorizedProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" ||
        product.broadCategory === selectedCategory;
      const matchesTherapeuticArea =
        selectedTherapeuticArea === "All" ||
        product.therapeuticArea === selectedTherapeuticArea;
      const matchesSearch =
        !search ||
        [
          product.brandName,
          product.composition,
          product.dosageForm,
          product.broadCategory,
          product.therapeuticArea,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesTherapeuticArea && matchesSearch;
    });
  }, [
    categorizedProducts,
    query,
    selectedCategory,
    selectedTherapeuticArea,
  ]);

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

  const allVisibleSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((product) => hasProduct(product.slug));

  return (
    <div className="space-y-8">
      <CatalogFilters
        idPrefix="doctor-presentation-filter"
        query={query}
        selectedCategory={selectedCategory}
        selectedTherapeuticArea={selectedTherapeuticArea}
        resultCount={filteredProducts.length}
        totalCount={products.length}
        onFilterChange={replaceFilter}
        action={
          filteredProducts.length > 0 ? (
            <button
              type="button"
              onClick={() =>
                addProducts(filteredProducts.map((product) => product.slug))
              }
              disabled={allVisibleSelected}
              className="secondary-button min-h-11 w-full px-4 sm:w-auto"
            >
              {allVisibleSelected ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Plus className="h-4 w-4" aria-hidden="true" />
              )}
              {allVisibleSelected ? "All selected" : "Select all"}
            </button>
          ) : undefined
        }
      />

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
        <div className="surface-card p-8 text-slate">
          <p>No products found.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="secondary-button mt-4 min-h-10 px-4"
          >
            Reset filters
          </button>
        </div>
      )}

      <BasketFloatingButton count={count} />
    </div>
  );
}
