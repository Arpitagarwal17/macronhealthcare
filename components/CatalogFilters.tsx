"use client";

import { Search } from "lucide-react";
import type { ReactNode } from "react";
import MobileFilterMenu from "@/components/MobileFilterMenu";
import type {
  CatalogFilterKey,
  TherapeuticFilter,
} from "@/components/useCatalogFilters";
import {
  getProductCategoryLabel,
  productCategoryFilters,
  type ProductCategoryFilter,
} from "@/data/productCategories";
import { therapeuticAreas } from "@/data/productMeta";

type CatalogFiltersProps = {
  idPrefix: string;
  query: string;
  selectedCategory: ProductCategoryFilter;
  selectedTherapeuticArea: TherapeuticFilter;
  resultCount: number;
  totalCount: number;
  onFilterChange: (key: CatalogFilterKey, value: string) => void;
  action?: ReactNode;
};

export default function CatalogFilters({
  idPrefix,
  query,
  selectedCategory,
  selectedTherapeuticArea,
  resultCount,
  totalCount,
  onFilterChange,
  action,
}: CatalogFiltersProps) {
  const therapeuticFilters: TherapeuticFilter[] = ["All", ...therapeuticAreas];

  return (
    <div className="rounded-xl border border-line bg-white p-4 shadow-premium sm:p-5">
      <label className="relative block">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => onFilterChange("q", event.target.value)}
          placeholder="Search brand or composition..."
          aria-label="Search by brand or composition"
          className="h-[52px] w-full rounded-lg border border-line bg-paper pl-12 pr-5 text-base text-ink outline-none transition placeholder:text-slate/65 focus-visible:border-blue focus-visible:bg-white focus-visible:ring-4 focus-visible:ring-blue/60"
        />
      </label>

      <div className="mt-4 border-t border-line pt-4">
        <MobileFilterMenu
          id={`${idPrefix}-category`}
          label="Filter by dosage form"
          value={selectedCategory}
          options={productCategoryFilters.map((category) => ({
            value: category,
            label: getProductCategoryLabel(category),
          }))}
          onChange={(value) => onFilterChange("category", value)}
        />

        <MobileFilterMenu
          id={`${idPrefix}-therapeutic`}
          label="Filter by therapeutic area"
          value={selectedTherapeuticArea}
          options={therapeuticFilters.map((area) => ({
            value: area,
            label: area,
          }))}
          onChange={(value) => onFilterChange("therapeutic", value)}
        />

        <div className="hidden space-y-4 sm:block">
          <FilterRow label="Dosage form">
            {productCategoryFilters.map((category) => (
              <FilterChip
                key={category}
                label={getProductCategoryLabel(category)}
                isSelected={selectedCategory === category}
                onClick={() => onFilterChange("category", category)}
              />
            ))}
          </FilterRow>

          <FilterRow label="Therapeutic area">
            {therapeuticFilters.map((area) => (
              <FilterChip
                key={area}
                label={area}
                isSelected={selectedTherapeuticArea === area}
                onClick={() => onFilterChange("therapeutic", area)}
              />
            ))}
          </FilterRow>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p
            role="status"
            aria-live="polite"
            className="text-sm font-bold text-slate"
          >
            {resultCount} of {totalCount} products
          </p>
          {action}
        </div>
      </div>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-3 md:grid-cols-[150px_1fr] md:items-start">
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
      aria-pressed={isSelected}
      className={`h-[38px] shrink-0 rounded-full border px-4 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 ${
        isSelected
          ? "border-blue bg-blue text-white shadow-soft"
          : "border-blue/15 bg-white text-slate hover:border-blue/45 hover:text-blue"
      }`}
    >
      {label}
    </button>
  );
}
