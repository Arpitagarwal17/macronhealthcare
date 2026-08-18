"use client";

import Link from "next/link";
import { Eye, ShoppingBasket, Trash2 } from "lucide-react";
import type { Product } from "@/data/products";
import VisualAidImage from "@/components/VisualAidImage";
import { getProductImageAlt } from "@/data/productMeta";

type ProductCardProps = {
  product: Product;
  isInBasket: boolean;
  onAddToBasket: (slug: string) => void;
  onRemoveFromBasket: (slug: string) => void;
  priority?: boolean;
};

export default function ProductCard({
  product,
  isInBasket,
  onAddToBasket,
  onRemoveFromBasket,
  priority = false,
}: ProductCardProps) {
  return (
    <article className="group surface-card flex h-full flex-col overflow-hidden transition duration-200 hover:-translate-y-1 hover:border-blue/30 hover:shadow-premium">
      <Link
        href={`/doctor-presentation/${product.slug}`}
        aria-label={`View ${product.brandName} presentation`}
      >
        <VisualAidImage
          src={product.visualAidImage}
          alt={getProductImageAlt(product)}
          className="aspect-[16/9] border-b border-line"
          imageClassName="p-2 transition duration-300 group-hover:scale-[1.015]"
          sizes="(min-width: 1280px) 370px, (min-width: 640px) 50vw, calc(100vw - 40px)"
          priority={priority}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-extrabold leading-tight text-ink">
            {product.brandName}
          </h3>
          <span className="max-w-[48%] rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-center text-xs font-bold leading-5 text-blue">
            {product.dosageForm}
          </span>
        </div>
        <div className="mt-4">
          <p className="field-label">Composition</p>
          <p className="mt-2 line-clamp-3 break-words text-[15px] leading-6 text-slate [overflow-wrap:anywhere]">
            {product.composition}
          </p>
        </div>
        <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
          <Link
            href={`/doctor-presentation/${product.slug}`}
            className="secondary-button min-h-11 px-3"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            View
          </Link>
          <button
            type="button"
            onClick={() =>
              isInBasket
                ? onRemoveFromBasket(product.slug)
                : onAddToBasket(product.slug)
            }
            aria-pressed={isInBasket}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 text-sm font-bold shadow-soft transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 ${
              isInBasket
                ? "border-red-200 bg-red-50 text-red-700 hover:border-red-300 hover:bg-red-100"
                : "border-blue bg-blue text-white hover:border-teal hover:bg-teal"
            }`}
          >
            {isInBasket ? (
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            )}
            {isInBasket ? "Remove" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
