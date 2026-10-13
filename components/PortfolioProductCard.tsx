"use client";

import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { createWhatsAppLink } from "@/data/company";
import ProductPhotoPreview from "@/components/ProductPhotoPreview";
import { CatalogProductLink } from "@/components/ProductNavigationLinks";
import { useCatalogCardAnchor } from "@/components/useCatalogCardAnchor";

export default function PortfolioProductCard({ product }: { product: Product }) {
  const cardAnchor = useCatalogCardAnchor(product.slug);
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = product.composition.length > 105;
  const enquiryLink = createWhatsAppLink(
    `Hello Macron Health Care, I would like to enquire about ${product.brandName}.`,
  );

  return (
    <article {...cardAnchor} className="group surface-card flex h-full scroll-mt-4 flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-blue/30 hover:shadow-premium">
      <CatalogProductLink
        routeBase="/product-portfolio"
        slug={product.slug}
        className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue/60"
        aria-label={`View ${product.brandName} product details`}
      >
        <ProductPhotoPreview
          product={product}
          sizes="(min-width: 1280px) 370px, (min-width: 768px) 50vw, calc(100vw - 40px)"
        />
      </CatalogProductLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="break-words text-xl font-semibold leading-tight text-blue">
            {product.brandName}
          </h3>
          <span className="max-w-[48%] shrink-0 rounded-full border border-line bg-porcelain px-3 py-1 text-center text-xs font-semibold leading-5 text-blue">
            {product.dosageForm}
          </span>
        </div>

        <div className="mt-4">
          <p className="field-label">Composition</p>
          <p
            className={`mt-2 break-words text-[15px] leading-6 text-slate [overflow-wrap:anywhere] ${
              isExpanded ? "" : "line-clamp-2"
            }`}
          >
            {product.composition}
          </p>
          {canExpand ? (
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="mt-2 text-sm font-semibold text-blue transition hover:text-tealDark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>

        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <CatalogProductLink
            routeBase="/product-portfolio"
            slug={product.slug}
            className="secondary-button min-h-11 px-3"
          >
            View
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </CatalogProductLink>
          <a
            href={enquiryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-button min-h-11 px-3"
            aria-label={`Enquire about ${product.brandName} on WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Enquire
          </a>
        </div>
      </div>
    </article>
  );
}
