"use client";

import { Download, MessageCircle, ShoppingBasket, Trash2 } from "lucide-react";
import { useState, type MouseEvent } from "react";
import {
  fetchAndDeliverFile,
  isNativeApp,
} from "@/components/fileDelivery";
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
  const visualAidFileName = `${product.slug}-visual-aid.${visualAidExtension}`;
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleVisualAidDownload = async (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isNativeApp()) {
      return;
    }

    event.preventDefault();

    if (isDownloading) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      await fetchAndDeliverFile(product.visualAidImage, visualAidFileName, {
        shareTitle: `${product.brandName} visual aid`,
      });
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "The visual aid could not be shared. Please try again.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

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
              ? "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 shadow-soft transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
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
        download={visualAidFileName}
        onClick={handleVisualAidDownload}
        aria-busy={isDownloading}
        className="secondary-button"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        {isDownloading ? "Preparing image..." : "Download Image"}
      </a>
      {downloadError ? (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {downloadError}
        </p>
      ) : null}
    </div>
  );
}
