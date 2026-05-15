export const productCategories = [
  "Tablets",
  "Capsules",
  "Syrups",
  "Dry Syrups",
  "Injections",
  "Miscellaneous",
] as const;

export const productCategoryFilters = ["All", ...productCategories] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategoryFilter = (typeof productCategoryFilters)[number];

export function getProductCategoryLabel(category: ProductCategoryFilter) {
  return category;
}

const hasDoseToken = (dosageForm: string, token: string) =>
  new RegExp(`(^|[^a-z0-9])${token}([^a-z0-9]|$)`, "i").test(dosageForm);

export function getProductCategory(dosageForm: string): ProductCategory {
  const normalized = dosageForm.toLowerCase();

  if (
    normalized.includes("dry syrup") ||
    normalized.includes("oral suspension") ||
    normalized.includes("powder for suspension")
  ) {
    return "Dry Syrups";
  }

  if (
    normalized.includes("tablet") ||
    normalized.includes("dispersible") ||
    normalized.includes("chewable") ||
    normalized.includes("sustained release tablet") ||
    normalized.includes("extended release tablet") ||
    hasDoseToken(dosageForm, "er") ||
    hasDoseToken(dosageForm, "sr") ||
    hasDoseToken(dosageForm, "xr") ||
    hasDoseToken(dosageForm, "dt")
  ) {
    return "Tablets";
  }

  if (
    normalized.includes("capsule") ||
    normalized.includes("soft gelatin") ||
    normalized.includes("softgel") ||
    normalized.includes("hard gelatin")
  ) {
    return "Capsules";
  }

  if (
    normalized.includes("syrup") ||
    normalized.includes("ayurvedic syrup") ||
    normalized.includes("tonic")
  ) {
    return "Syrups";
  }

  if (normalized.includes("injection")) {
    return "Injections";
  }

  return "Miscellaneous";
}
