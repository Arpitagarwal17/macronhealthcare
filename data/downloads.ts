export const PRODUCT_CARD_PDF = "/assets/pdfs/macron-product-card.pdf?v=20261014-2";

export const productDownloads = {
  productCard: {
    label: "Product Card",
    buttonLabel: "Download Product Card",
    href: PRODUCT_CARD_PDF,
    fileName: "Macron-Health-Care-Product-Card.pdf",
  },
  productList: {
    label: "MRP List 2026",
    buttonLabel: "Download MRP List",
    href: "/downloads/macron-healthcare-updated-mrp-list-2026.pdf?v=20261014-1",
    fileName: "Macron-Healthcare-Updated-MRP-List-2026.pdf",
  },
} as const;
