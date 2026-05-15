export const PRODUCT_CARD_PDF = "/assets/pdfs/macron-product-card.pdf";

export const productDownloads = {
  productCard: {
    label: "Product Card",
    buttonLabel: "Download Product Card",
    href: PRODUCT_CARD_PDF,
    fileName: "Macron-Health-Care-Product-Card.pdf",
  },
  productList: {
    label: "Product List",
    buttonLabel: "Download Product List",
    href: "/downloads/macron-product-list-2026 (1)(1).pdf",
    fileName: "macron-product-list-2026 (1)(1).pdf",
  },
} as const;
