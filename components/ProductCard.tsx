"use client";

import Link from "next/link";
import type { Product } from "@/data/products";
import VisualAidImage from "@/components/VisualAidImage";

type ProductCardProps = {
  product: Product;
  isInBasket: boolean;
  onAddToBasket: (slug: string) => void;
};

export default function ProductCard({
  product,
  isInBasket,
  onAddToBasket,
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.1rem] border border-line bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-blue/35 hover:shadow-premium">
      <VisualAidImage
        src={product.visualAidImage}
        alt={product.brandName}
        className="aspect-[4/3] border-b border-line"
        imageClassName="p-4"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
      />
      <div className="flex flex-1 flex-col gap-4 p-5">
        <h2 className="text-xl font-semibold leading-tight text-ink">
          {product.brandName}
        </h2>
        <div className="space-y-1">
          <p className="field-label">Composition</p>
          <p className="break-words text-[15px] leading-7 text-slate [overflow-wrap:anywhere]">
            {product.composition}
          </p>
        </div>
        <div className="space-y-1">
          <p className="field-label">Dosage Form</p>
          <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold leading-5 text-blue">
            {product.dosageForm}
          </span>
        </div>
        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <Link
            href={`/doctor-presentation/${product.slug}`}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-4 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15"
          >
            View Presentation
          </Link>
          <button
            type="button"
            onClick={() => onAddToBasket(product.slug)}
            disabled={isInBasket}
            aria-pressed={isInBasket}
            className={`inline-flex min-h-11 items-center justify-center rounded-md border px-4 text-sm font-semibold shadow-soft transition duration-200 focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-default ${
              isInBasket
                ? "border-green/20 bg-green/10 text-green"
                : "border-line bg-white text-ink hover:border-blue hover:text-blue"
            }`}
          >
            {isInBasket ? "Added \u2713" : "Add to Basket"}
          </button>
        </div>
      </div>
    </article>
  );
}
