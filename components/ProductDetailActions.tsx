"use client";

import { Check, Download, MessageCircle, ShoppingBasket } from "lucide-react";
import { useBasket } from "@/components/useBasket";
import { createWhatsAppLink } from "@/data/company";
import type { Product } from "@/data/products";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addProduct, hasProduct } = useBasket();
  const isInBasket = hasProduct(product.slug);
  const enquiryLink = createWhatsAppLink(
    `Hello Macron Health Care, I would like to enquire about ${product.brandName}.`,
  );

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => addProduct(product.slug)}
        disabled={isInBasket}
        className="primary-button"
      >
        {isInBasket ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
        )}
        {isInBasket ? "Added to Basket" : "Add to Basket"}
      </button>
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
        download={`${product.slug}-visual-aid.png`}
        className="secondary-button"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download Image
      </a>
    </div>
  );
}
