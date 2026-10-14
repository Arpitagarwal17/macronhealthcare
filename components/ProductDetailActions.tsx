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
  imageKind,
}: {
  product: Product;
  showBasketAction?: boolean;
  imageKind: "product image" | "visual aid";
}) {
  const { addProduct, hasProduct, removeProduct } = useBasket();
  const isInBasket = hasProduct(product.slug);
  const enquiryLink = createWhatsAppLink(
    `Hello Macron Health Care, I would like to enquire about ${product.brandName}.`,
  );
  const imageSrc =
    imageKind === "product image"
      ? product.productImages?.[0]?.src
      : product.visualAidImage;
  const imageExtension =
    imageSrc?.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase() ?? "jpg";
  const downloadName = `${product.brandName}-${product.dosageForm}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const imageFileName = `${downloadName}-${imageKind.replace(/ /g, "-")}.${imageExtension}`;
  const downloadLabel =
    imageKind === "product image"
      ? "Download Product Image"
      : "Download Visual Aid Image";
  const [downloadError, setDownloadError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleImageDownload = async (
    event: MouseEvent<HTMLAnchorElement>,
  ) => {
    if (!isNativeApp()) {
      return;
    }

    event.preventDefault();

    if (isDownloading || !imageSrc) {
      return;
    }

    setIsDownloading(true);
    setDownloadError("");

    try {
      await fetchAndDeliverFile(imageSrc, imageFileName, {
        shareTitle: `${product.brandName} ${imageKind}`,
      });
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : `The ${imageKind} could not be downloaded. Please try again.`,
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
              ? "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 text-sm font-bold text-red-700 shadow-soft transition hover:border-red-300 hover:bg-red-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-600"
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
      {imageKind === "product image" ? (
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
      ) : null}
      {imageSrc ? (
        <a
          href={imageSrc}
          download={imageFileName}
          onClick={handleImageDownload}
          aria-busy={isDownloading}
          className="secondary-button"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          {isDownloading ? `Preparing ${imageKind}...` : downloadLabel}
        </a>
      ) : null}
      {downloadError ? (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {downloadError}
        </p>
      ) : null}
    </div>
  );
}
