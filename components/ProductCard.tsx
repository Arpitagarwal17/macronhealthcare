"use client";

import Link from "next/link";
import { Check, Eye, ShoppingBasket } from "lucide-react";
import type { Product } from "@/data/products";
import VisualAidImage from "@/components/VisualAidImage";

type ProductCardProps = {
  product: Product;
  isInBasket: boolean;
  onAddToBasket: (slug: string) => void;
  priority?: boolean;
};

export default function ProductCard({
  product,
  isInBasket,
  onAddToBasket,
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
          alt={`${product.brandName} Macron Health Care product visual aid`}
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
            onClick={() => onAddToBasket(product.slug)}
            disabled={isInBasket}
            aria-pressed={isInBasket}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-bold shadow-soft transition focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-default ${
              isInBasket
                ? "border border-green/20 bg-green/10 text-green"
                : "bg-blue text-white hover:bg-teal"
            }`}
          >
            {isInBasket ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            )}
            {isInBasket ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}
