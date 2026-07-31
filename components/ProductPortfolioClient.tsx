"use client";

import { Download, Eye, FileText, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import MobileFilterMenu from "@/components/MobileFilterMenu";
import PortfolioProductCard from "@/components/PortfolioProductCard";
import { productDownloads } from "@/data/downloads";
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
import type { Product } from "@/data/products";

type ProductPortfolioClientProps = {
  products: Product[];
};

type TherapeuticFilter = "All" | TherapeuticArea;

type CategorizedProduct = Product & {
  category: ProductCategory;
  therapeuticArea: TherapeuticArea;
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
  const [selectedTherapeuticArea, setSelectedTherapeuticArea] =
    useState<TherapeuticFilter>("All");
  const downloads = [productDownloads.productCard, productDownloads.productList];

  const categorizedProducts = useMemo<CategorizedProduct[]>(
    () =>
      products.map((product) => ({
        ...product,
        category: getProductCategory(product.dosageForm),
        therapeuticArea: getTherapeuticArea(product),
      })),
    [products],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const therapeutic = params.get("therapeutic");

    if (
      category &&
      productCategoryFilters.includes(category as ProductCategoryFilter)
    ) {
      setSelectedCategory(category as ProductCategoryFilter);
    }

    if (
      therapeutic &&
      therapeuticAreas.includes(therapeutic as TherapeuticArea)
    ) {
      setSelectedTherapeuticArea(therapeutic as TherapeuticArea);
    }
  }, []);

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return categorizedProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesTherapeuticArea =
        selectedTherapeuticArea === "All" ||
        product.therapeuticArea === selectedTherapeuticArea;
      const matchesSearch =
        !search ||
        [
          product.brandName,
          product.composition,
          product.dosageForm,
          product.category,
          product.therapeuticArea,
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      return matchesCategory && matchesTherapeuticArea && matchesSearch;
    });
  }, [categorizedProducts, query, selectedCategory, selectedTherapeuticArea]);

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

  return (
    <div className="space-y-8">
      <div>
        <div className="max-w-2xl space-y-3">
          <p className="field-label text-teal">Macron Health Care</p>
          <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Product Portfolio
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate">
            Search by brand or molecule and browse the current portfolio by dosage
            form or therapeutic area.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {downloads.map((item) => (
          <article
            key={item.label}
            className="surface-card flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex min-w-0 items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue text-white">
                <FileText className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold text-ink">{item.label}</h2>
              </div>
            </div>
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="secondary-button min-h-11 px-3"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                View
              </a>
              <a
                href={item.href}
                download={item.fileName}
                className="primary-button min-h-11 px-3"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download
              </a>
            </div>
          </article>
        ))}
      </div>

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

        <MobileFilterMenu
          id="portfolio-dosage-filter"
          label="Filter by dosage form"
          value={selectedCategory}
          options={productCategoryFilters.map((category) => ({
            value: category,
            label: getProductCategoryLabel(category),
          }))}
          onChange={(value) => setSelectedCategory(value as ProductCategoryFilter)}
        />

        <MobileFilterMenu
          id="portfolio-therapeutic-filter"
          label="Filter by therapeutic area"
          value={selectedTherapeuticArea}
          options={(["All", ...therapeuticAreas] as TherapeuticFilter[]).map((area) => ({
            value: area,
            label: area,
          }))}
          onChange={(value) => setSelectedTherapeuticArea(value as TherapeuticFilter)}
        />

        <FilterRow label="Dosage form">
          {productCategoryFilters.map((category) => (
            <FilterChip
              key={category}
              label={getProductCategoryLabel(category)}
              isSelected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            />
          ))}
        </FilterRow>

        <FilterRow label="Therapeutic area">
          {(["All", ...therapeuticAreas] as TherapeuticFilter[]).map((area) => (
            <FilterChip
              key={area}
              label={area}
              isSelected={selectedTherapeuticArea === area}
              onClick={() => setSelectedTherapeuticArea(area)}
            />
          ))}
        </FilterRow>

      </div>

      <p className="text-sm font-semibold text-slate">
        Products intended for trade and healthcare professionals.
      </p>

      {sections.length ? (
        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.category} className="space-y-5">
              <div className="border-b border-line pb-3">
                <h2 className="text-2xl font-extrabold text-ink">
                  {getProductCategoryLabel(section.category)}
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product) => (
                  <PortfolioProductCard key={product.slug} product={product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="surface-card p-8 text-slate">No products found.</div>
      )}
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 hidden gap-2 sm:grid lg:grid-cols-[130px_minmax(0,1fr)] lg:items-start">
      <p className="pt-2 text-sm font-bold text-slate">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function FilterChip({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[38px] shrink-0 rounded-full border px-4 text-sm font-bold transition focus:outline-none focus:ring-4 focus:ring-blue/10 ${
        isSelected
          ? "border-blue bg-blue text-white shadow-soft"
          : "border-blue/15 bg-white text-slate hover:border-blue/45 hover:text-blue"
      }`}
    >
      {label}
    </button>
  );
}
