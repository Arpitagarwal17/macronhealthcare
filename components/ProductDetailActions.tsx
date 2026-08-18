"use client";

import { Download, MessageCircle, ShoppingBasket, Trash2 } from "lucide-react";
import { useBasket } from "@/components/useBasket";
import { createWhatsAppLink } from "@/data/company";
import type { Product } from "@/data/products";

export default function ProductDetailActions({
  product,
  showBasketAction = true,
}: {
  product: Product;
  showBasketAction?: boolean;
}) {
  const { addProduct, hasProduct, removeProduct } = useBasket();
  const isInBasket = hasProduct(product.slug);
  const enquiryLink = createWhatsAppLink(
    `Hello Macron Health Care, I would like to enquire about ${product.brandName}.`,
  );
  const visualAidExtension =
    product.visualAidImage.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? "jpg";

  return (
    <div className="grid gap-3">
      {showBasketAction ? (
        <button
          type="button"
          onClick={() =>
            isInBasket ? removeProduct(product.slug) : addProduct(product.slug)
          }
          aria-pressed={isInBasket}
          className={
            isInBasket
              ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 shadow-soft transition hover:border-red-300 hover:bg-red-100 focus:outline-none focus:ring-4 focus:ring-red-100"
              : "primary-button"
          }
        >
          {isInBasket ? (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
          )}
          {isInBasket ? "Remove from Basket" : "Add to Basket"}
        </button>
      ) : null}
      <a
        href={enquiryLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
        aria-label={`Enquire about ${product.brandName} on WhatsApp`}
      >
        <MessageCircle className="h-4 w-4" aria-hidden="true" />
        WhatsApp Enquiry
      </a>
      <a
        href={product.visualAidImage}
        download={`${product.slug}-visual-aid.${visualAidExtension}`}
        className="secondary-button"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download Image
      </a>
    </div>
  );
}
