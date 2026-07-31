"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/data/products";
import { createWhatsAppLink } from "@/data/company";

export default function PortfolioProductCard({ product }: { product: Product }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canExpand = product.composition.length > 105;
  const enquiryLink = createWhatsAppLink(
    `Hello Macron Health Care, I would like to enquire about ${product.brandName}.`,
  );

  return (
    <article className="group surface-card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-blue/30 hover:shadow-premium">
      <Link
        href={`/doctor-presentation/${product.slug}`}
        className="relative aspect-[16/9] overflow-hidden border-b border-line bg-white"
        aria-label={`View ${product.brandName} presentation`}
      >
        <Image
          src={product.visualAidImage}
          alt={`${product.brandName} Macron Health Care product visual aid`}
          fill
          sizes="(min-width: 1280px) 370px, (min-width: 768px) 50vw, calc(100vw - 40px)"
          className="object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="break-words text-xl font-extrabold leading-tight text-ink">
            {product.brandName}
          </h3>
          <span className="max-w-[48%] shrink-0 rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-center text-xs font-bold leading-5 text-blue">
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
              className="mt-2 text-sm font-bold text-blue transition hover:text-teal focus:outline-none focus:ring-4 focus:ring-blue/10"
              aria-expanded={isExpanded}
            >
              {isExpanded ? "Show less" : "Show more"}
            </button>
          ) : null}
        </div>

        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <Link
            href={`/doctor-presentation/${product.slug}`}
            className="secondary-button min-h-11 px-3"
          >
            View
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
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
