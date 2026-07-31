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
    href: "/downloads/macron-healthcare-updated-mrp-list-2026.pdf",
    fileName: "Macron-Healthcare-Updated-MRP-List-2026.pdf",
  },
} as const;
