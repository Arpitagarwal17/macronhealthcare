"use client";

import { useMemo, useState } from "react";
import { productDownloads } from "@/data/downloads";
import {
  getProductCategory,
  getProductCategoryLabel,
  productCategories,
  productCategoryFilters,
  type ProductCategory,
  type ProductCategoryFilter,
} from "@/data/productCategories";
import type { Product } from "@/data/products";

type ProductPortfolioClientProps = {
  products: Product[];
};

type CategorizedProduct = Product & {
  category: ProductCategory;
};

const sortByBrandName = (items: CategorizedProduct[]) =>
  [...items].sort((first, second) =>
    first.brandName.localeCompare(second.brandName, undefined, {
      sensitivity: "base",
    }),
  );

export default function ProductPortfolioClient({
  products,
}: ProductPortfolioClientProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategoryFilter>("All");
  const downloads = [productDownloads.productCard, productDownloads.productList];

  const categorizedProducts = useMemo<CategorizedProduct[]>(
    () =>
      products.map((product) => ({
        ...product,
        category: getProductCategory(product.dosageForm),
      })),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    const categoryFiltered =
      selectedCategory === "All"
        ? categorizedProducts
        : categorizedProducts.filter(
            (product) => product.category === selectedCategory,
          );

    if (!search) {
      return categoryFiltered;
    }

    return categoryFiltered.filter((product) =>
      [product.brandName, product.composition]
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [categorizedProducts, query, selectedCategory]);

  const sections = useMemo(() => {
    if (selectedCategory !== "All") {
      const productsInCategory = sortByBrandName(filteredProducts);

      return productsInCategory.length
        ? [{ category: selectedCategory, products: productsInCategory }]
        : [];
    }

    return productCategories
      .map((category) => ({
        category,
        products: sortByBrandName(
          filteredProducts.filter((product) => product.category === category),
        ),
      }))
      .filter((section) => section.products.length > 0);
  }, [filteredProducts, selectedCategory]);

  const productCountLabel =
    selectedCategory === "All"
      ? `Showing ${filteredProducts.length} products`
      : `${getProductCategoryLabel(selectedCategory)} - ${filteredProducts.length} products`;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="field-label text-blue">Macron Health Care</p>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            Product Portfolio
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:min-w-[540px]">
          {downloads.map((item) => (
            <article
              key={item.label}
              className="rounded-[1rem] border border-line bg-white p-4 shadow-soft"
            >
              <p className="field-label text-blue">{item.label}</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue/20 bg-white px-4 text-sm font-semibold text-blue transition duration-200 hover:border-blue hover:bg-porcelain focus:outline-none focus:ring-4 focus:ring-blue/10"
                >
                  View {item.label}
                </a>
                <a
                  href={item.href}
                  download={item.fileName}
                  className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-4 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15"
                >
                  {item.buttonLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="rounded-[1.1rem] border border-line bg-white p-4 shadow-soft sm:p-5">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search brand or composition..."
          aria-label="Search by brand or composition"
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

      {sections.length ? (
        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.category} className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-2xl font-semibold text-ink">
                  {getProductCategoryLabel(section.category)}
                </h2>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate">
                  {section.products.length}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product) => (
                  <article
                    key={product.slug}
                    className="flex min-h-[180px] flex-col rounded-[1.1rem] border border-line bg-white p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-blue/25 hover:shadow-premium"
                  >
                    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                      <h3 className="break-words text-2xl font-semibold leading-tight text-blue">
                        {product.brandName}
                      </h3>
                      <span className="rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold leading-5 text-blue">
                        {product.dosageForm}
                      </span>
                    </div>

                    <p className="break-words text-base leading-7 text-slate [overflow-wrap:anywhere]">
                      {product.composition}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.1rem] border border-line bg-white p-8 text-slate shadow-soft">
          No products found.
        </div>
      )}
    </div>
  );
}
