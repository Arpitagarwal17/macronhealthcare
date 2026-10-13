import type { Metadata } from "next";
import { company } from "@/data/company";
import { splitComposition } from "@/data/productMeta";
import type { Product } from "@/data/products";
import { absoluteUrl } from "@/data/seo";

/** Include the form so brands such as Lycron and Molly-Forte stay distinct. */
export function getProductDisplayName(product: Product): string {
  return product.brandName.toLowerCase().includes(product.dosageForm.toLowerCase())
    ? product.brandName
    : `${product.brandName} ${product.dosageForm}`;
}

export function getProductDescription(product: Product): string {
  const prefix = `${getProductDisplayName(product)} by ${company.displayName}.`;
  const ingredients = splitComposition(product.composition);
  const selected: string[] = [];

  // Summarise long labels at ingredient boundaries, never part-way through a
  // strength or release form. The complete label remains in HTML and JSON-LD.
  for (const ingredient of ingredients) {
    if (selected.length && [...selected, ingredient].join(" + ").length > 130) break;
    selected.push(ingredient);
  }
  const summary = selected.join(" + ").replace(/\.$/, "");
  return selected.length === ingredients.length
    ? `${prefix} Composition: ${summary}. View product details.`
    : `${prefix} Composition includes: ${summary}. See the full composition.`;
}

export function getProductMetadata(product: Product): Metadata {
  const name = getProductDisplayName(product);
  const compositionTitle = `${name} | ${product.composition} | ${company.displayName}`;
  const title = compositionTitle.length <= 95
    ? compositionTitle
    : `${name} | Composition | ${company.displayName}`;
  const description = getProductDescription(product);
  const path = `/product-portfolio/${product.slug}`;
  const photos = product.productImages ?? [];

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: company.displayName,
      locale: "en_IN",
      type: "website",
      images: photos.map((photo) => ({
        url: photo.src,
        width: photo.width,
        height: photo.height,
        type: "image/jpeg",
        alt: `${photo.label} product packaging from ${company.displayName}`,
      })),
    },
    twitter: {
      card: photos.length ? "summary_large_image" : "summary",
      title,
      description,
      images: photos.map((photo) => photo.src),
    },
  };
}

export function getProductStructuredData(product: Product) {
  const url = absoluteUrl(`/product-portfolio/${product.slug}`);
  const name = getProductDisplayName(product);
  const image = product.productImages?.map((photo) => absoluteUrl(photo.src));

  // This is an informational catalogue, without offers or customer reviews.
  // WebPage + Thing describes it accurately without ineligible shopping markup.
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${name} | ${company.displayName}`,
        description: getProductDescription(product),
        inLanguage: "en-IN",
        isPartOf: { "@id": absoluteUrl("/#website") },
        publisher: { "@id": absoluteUrl("/#organization") },
        mainEntity: { "@id": `${url}#product` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        hasPart: {
          "@type": "WebPageElement",
          "@id": `${url}#composition`,
          name: "Composition",
          text: product.composition,
        },
      },
      {
        "@type": "Thing",
        "@id": `${url}#product`,
        name,
        url,
        image,
        description: `${name}. Composition: ${product.composition}. Dosage form: ${product.dosageForm}. Marketed by ${company.displayName}.`,
        subjectOf: { "@id": `${url}#webpage` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Product Portfolio", item: absoluteUrl("/product-portfolio") },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
}
