export const productCategories = [
  "Tablets",
  "Capsules",
  "Syrups",
  "Dry Syrups",
  "Drops",
  "Injections",
  "Powders / Sachets",
  "Topicals / External",
  "Others",
] as const;

export const productCategoryFilters = ["All", ...productCategories] as const;

export type ProductCategory = (typeof productCategories)[number];
export type ProductCategoryFilter = (typeof productCategoryFilters)[number];

export function getProductCategoryLabel(category: ProductCategoryFilter) {
  if (category === "Topicals / External") {
    return "External/Pain Oil";
  }

  if (category === "Powders / Sachets") {
    return "Powders";
  }

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

  if (
    normalized.includes("drops") ||
    normalized.includes("oral drops") ||
    normalized.includes("pediatric drops") ||
    normalized.includes("eye drops") ||
    normalized.includes("ear drops") ||
    normalized.includes("nasal drops")
  ) {
    return "Drops";
  }

  if (
    normalized.includes("pain oil") ||
    normalized.includes("oil") ||
    normalized.includes("liniment") ||
    normalized.includes("gel") ||
    normalized.includes("cream") ||
    normalized.includes("ointment") ||
    normalized.includes("lotion") ||
    normalized.includes("balm")
  ) {
    return "Topicals / External";
  }

  if (normalized.includes("injection")) {
    return "Injections";
  }

  if (
    normalized.includes("powder") ||
    normalized.includes("sachet") ||
    normalized.includes("granules")
  ) {
    return "Powders / Sachets";
  }

  return "Others";
}
