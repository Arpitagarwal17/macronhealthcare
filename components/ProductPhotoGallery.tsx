import ZoomableVisualAid from "@/components/ZoomableVisualAid";
import type { Product } from "@/data/products";

export default function ProductPhotoGallery({ product }: { product: Product }) {
  const photo = product.productImages?.[0];

  if (!photo) {
    return (
      <div
        className="aspect-[16/9] w-full rounded-2xl border border-line bg-white shadow-premium"
        role="img"
        aria-label={`Product photo not provided for ${product.brandName}`}
      />
    );
  }

  return (
    <ZoomableVisualAid
      key={photo.src}
      src={photo.src}
      alt={`${photo.label} product packaging from Macron Health Care`}
      imageKind="product photo"
    />
  );
}
