"use client";

import { Download, Eye, FileText } from "lucide-react";
import { useMemo, useState, type MouseEvent } from "react";
import CatalogAudienceBanner from "@/components/CatalogAudienceBanner";
import CatalogFilters from "@/components/CatalogFilters";
import PortfolioProductCard from "@/components/PortfolioProductCard";
import {
  fetchAndDeliverFile,
  isNativeApp,
} from "@/components/fileDelivery";
import { useCatalogFilters } from "@/components/useCatalogFilters";
import { productDownloads } from "@/data/downloads";
import {
  getProductCategory,
  getProductCategoryLabel,
  productCategories,
  type ProductCategory,
} from "@/data/productCategories";
import { getTherapeuticArea, type TherapeuticArea } from "@/data/productMeta";
import type { Product } from "@/data/products";

type ProductPortfolioClientProps = {
  products: Product[];
};

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
  const {
    query,
    selectedCategory,
    selectedTherapeuticArea,
    replaceFilter,
    resetFilters,
  } = useCatalogFilters();
  const downloads = [productDownloads.productCard, productDownloads.productList];
  const [activeDownload, setActiveDownload] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState("");

  const handleDownload = async (
    event: MouseEvent<HTMLAnchorElement>,
    item: (typeof downloads)[number],
  ) => {
    if (!isNativeApp()) {
      return;
    }

    event.preventDefault();
    if (activeDownload) {
      return;
    }

    setActiveDownload(item.label);
    setDownloadError("");
    try {
      await fetchAndDeliverFile(item.href, item.fileName, {
        shareTitle: item.label,
      });
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : `${item.label} could not be shared. Please try again.`,
      );
    } finally {
      setActiveDownload(null);
    }
  };

  const categorizedProducts = useMemo<CategorizedProduct[]>(
    () =>
      products.map((product) => ({
        ...product,
        category: getProductCategory(product.dosageForm),
        therapeuticArea: getTherapeuticArea(product),
      })),
    [products],
  );

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
          <p className="field-label text-tealDark">Macron Health Care</p>
          <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Product Portfolio
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate">
            Search by brand or molecule and browse the current portfolio by dosage
            form or therapeutic area.
          </p>
        </div>
      </div>

      <CatalogAudienceBanner current="portfolio" />

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
                onClick={(event) => handleDownload(event, item)}
                aria-busy={activeDownload === item.label}
                className="primary-button min-h-11 px-3"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {activeDownload === item.label ? "Preparing…" : "Download"}
              </a>
            </div>
          </article>
        ))}
      </div>

      {downloadError ? (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {downloadError}
        </p>
      ) : null}

      <CatalogFilters
        idPrefix="portfolio-filter"
        query={query}
        selectedCategory={selectedCategory}
        selectedTherapeuticArea={selectedTherapeuticArea}
        resultCount={filteredProducts.length}
        totalCount={products.length}
        onFilterChange={replaceFilter}
      />

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
    </div>
  );
}
