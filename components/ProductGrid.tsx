"use client";

import { Check, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import MobileFilterMenu from "@/components/MobileFilterMenu";
import type { Product } from "@/data/products";
import {
  getProductCategory,
  getProductCategoryLabel,
  productCategories,
  productCategoryFilters,
  type ProductCategory,
  type ProductCategoryFilter,
} from "@/data/productCategories";
import {
  getTherapeuticArea,
  therapeuticAreas,
  type TherapeuticArea,
} from "@/data/productMeta";
import BasketFloatingButton from "@/components/BasketFloatingButton";
import ProductCard from "@/components/ProductCard";
import { useBasket } from "@/components/useBasket";

type ProductGridProps = {
  products: Product[];
};

type TherapeuticFilter = "All" | TherapeuticArea;

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
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryFilter>("All");
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] =
    useState<TherapeuticFilter>("All");
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

        <div className="mt-4 border-t border-line pt-4">
          <MobileFilterMenu
            id="doctor-presentation-category"
            label="Filter by dosage form"
            value={selectedCategory}
            options={productCategoryFilters.map((category) => ({
              value: category,
              label: getProductCategoryLabel(category),
            }))}
            onChange={(value) =>
              setSelectedCategory(value as ProductCategoryFilter)
            }
          />

          <MobileFilterMenu
            id="doctor-presentation-therapeutic"
            label="Filter by therapeutic area"
            value={selectedTherapeuticArea}
            options={(["All", ...therapeuticAreas] as TherapeuticFilter[]).map(
              (area) => ({ value: area, label: area }),
            )}
            onChange={(value) =>
              setSelectedTherapeuticArea(value as TherapeuticFilter)
            }
          />

          <div className="hidden space-y-4 sm:block">
            <div className="grid gap-3 md:grid-cols-[150px_1fr] md:items-start">
              <p className="pt-2 text-sm font-bold text-slate">Dosage form</p>
              <div className="flex flex-wrap gap-2">
                {productCategoryFilters.map((category) => {
                  const isSelected = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`h-[38px] rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
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

            <div className="grid gap-3 md:grid-cols-[150px_1fr] md:items-start">
              <p className="pt-2 text-sm font-bold text-slate">
                Therapeutic area
              </p>
              <div className="flex flex-wrap gap-2">
                {(["All", ...therapeuticAreas] as TherapeuticFilter[]).map(
                  (area) => {
                    const isSelected = selectedTherapeuticArea === area;

                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setSelectedTherapeuticArea(area)}
                        className={`h-[38px] rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
                          isSelected
                            ? "border-blue bg-blue text-white shadow-soft"
                            : "border-blue/15 bg-white text-slate hover:border-blue/45 hover:text-blue"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="mt-4 flex justify-end">
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
            </div>
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
