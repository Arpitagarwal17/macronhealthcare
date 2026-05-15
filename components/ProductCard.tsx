import Link from "next/link";
import type { Product } from "@/data/products";
import FullScreenImageViewer from "@/components/FullScreenImageViewer";
import VisualAidImage from "@/components/VisualAidImage";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[1.1rem] border border-line bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-blue/35 hover:shadow-premium">
      <FullScreenImageViewer
        src={product.visualAidImage}
        alt={product.brandName}
        triggerClassName="block w-full cursor-zoom-in text-left focus:outline-none focus:ring-4 focus:ring-blue/10"
      >
        <VisualAidImage
          src={product.visualAidImage}
          alt={product.brandName}
          className="aspect-[4/3] border-b border-line"
          imageClassName="p-4"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
        />
      </FullScreenImageViewer>

      <Link
        href={`/products/${product.slug}`}
        className="block space-y-4 p-5 focus:outline-none focus:ring-4 focus:ring-blue/10"
      >
        <h2 className="text-xl font-semibold leading-tight text-ink">
          {product.brandName}
        </h2>
        <div className="space-y-1">
          <p className="field-label">Composition</p>
          <p className="break-words text-sm leading-6 text-slate [overflow-wrap:anywhere]">
            {product.composition}
          </p>
        </div>
        <div className="space-y-1">
          <p className="field-label">Dosage Form</p>
          <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold leading-5 text-blue">
            {product.dosageForm}
          </span>
        </div>
      </Link>
    </article>
  );
}
