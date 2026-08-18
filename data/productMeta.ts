import type { Product } from "@/data/products";

export const therapeuticAreas = [
  "Pain & Inflammation",
  "Antibiotics",
  "Gastro & Liver",
  "Neuro-Psychiatry",
  "Vitamins & Supplements",
  "Ayurvedic",
  "Respiratory & Allergy",
  "Cardiovascular",
] as const;

export type TherapeuticArea = (typeof therapeuticAreas)[number];

const therapeuticAreaBySlug: Record<string, TherapeuticArea> = {
  apcon: "Gastro & Liver",
  cloper: "Neuro-Psychiatry",
  "curix-200": "Antibiotics",
  "curix-oc": "Antibiotics",
  drt: "Pain & Inflammation",
  "drt-plus": "Pain & Inflammation",
  "ecitron-plus": "Neuro-Psychiatry",
  etr: "Pain & Inflammation",
  "etr-plus": "Pain & Inflammation",
  "etr-th": "Pain & Inflammation",
  "ferronica-drop": "Vitamins & Supplements",
  "ferronica-syrup": "Vitamins & Supplements",
  "flt-20": "Neuro-Psychiatry",
  "furakast-l": "Respiratory & Allergy",
  "gabonza-m": "Neuro-Psychiatry",
  heptamac: "Ayurvedic",
  "lycron-cap": "Vitamins & Supplements",
  "lycron-syrup": "Vitamins & Supplements",
  "m-trox-1500-sb": "Antibiotics",
  "maclo-p": "Pain & Inflammation",
  "maclo-th": "Pain & Inflammation",
  "maclodase-p": "Pain & Inflammation",
  "macrifa-400": "Antibiotics",
  "macron-cv-457": "Antibiotics",
  "macron-cv-625": "Antibiotics",
  "macron-oil-60-ml": "Ayurvedic",
  "macron-pro": "Vitamins & Supplements",
  macroncal: "Vitamins & Supplements",
  "macroncal-drop": "Vitamins & Supplements",
  "macroncef-200": "Antibiotics",
  "macroncef-50": "Antibiotics",
  "macronliv-300": "Gastro & Liver",
  mactuss: "Respiratory & Allergy",
  metoron: "Cardiovascular",
  "molly-forte-injection": "Vitamins & Supplements",
  "molly-forte-tablet": "Vitamins & Supplements",
  myflez: "Pain & Inflammation",
  "myorab-dsr": "Gastro & Liver",
  myotral: "Vitamins & Supplements",
  "myotral-k27": "Vitamins & Supplements",
  myovit: "Vitamins & Supplements",
  "nimtek-p": "Pain & Inflammation",
  "nucis-plus": "Pain & Inflammation",
  ppday: "Vitamins & Supplements",
  "ppzol-dsr": "Gastro & Liver",
  "propra-az": "Neuro-Psychiatry",
  "rabiday-dsr": "Gastro & Liver",
  "rabron-d": "Gastro & Liver",
  "rabron-dsr": "Gastro & Liver",
  "ravista-m": "Neuro-Psychiatry",
  turpiron: "Ayurvedic",
  "vertitop-16": "Neuro-Psychiatry",
  vitabank: "Vitamins & Supplements",
  vtrocef: "Antibiotics",
  walex: "Pain & Inflammation",
  "walex-p": "Pain & Inflammation",
  zymopan: "Gastro & Liver",
};

const packSizeBySlug: Record<string, string> = {
  apcon: "200 ml",
  "ferronica-drop": "15 ml",
  "ferronica-syrup": "200 ml",
  heptamac: "200 ml",
  "lycron-syrup": "200 ml",
  "m-trox-1500-sb": "Vial",
  "macron-cv-457": "30 ml WFI",
  "macron-cv-625": "1 x 6",
  "macron-oil-60-ml": "60 ml",
  "macron-pro": "200 g",
  "macroncal-drop": "30 ml",
  "macroncef-50": "30 ml WFI",
  mactuss: "100 ml",
  "molly-forte-injection": "Dispo Pack",
  ppday: "25 g sachet",
  zymopan: "200 ml",
};

export function getTherapeuticArea(product: Product): TherapeuticArea {
  return therapeuticAreaBySlug[product.slug] ?? "Vitamins & Supplements";
}

export function getProductPackSize(product: Product): string | null {
  return packSizeBySlug[product.slug] ?? null;
}

export function splitComposition(composition: string) {
  return composition
    .split(/\s+\+\s+/)
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
}

export function getProductImageAlt(product: Product) {
  const firstIngredient =
    splitComposition(product.composition)[0] ?? product.composition;
  const brandIncludesDosageForm = product.brandName
    .toLowerCase()
    .includes(product.dosageForm.toLowerCase());
  const productLabel = brandIncludesDosageForm
    ? product.brandName
    : `${product.brandName} ${product.dosageForm}`;

  return `${productLabel} visual aid: ${firstIngredient} by Macron Health Care`;
}
