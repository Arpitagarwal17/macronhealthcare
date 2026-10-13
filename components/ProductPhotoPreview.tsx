import Image from "next/image";
import type { Product } from "@/data/products";

export default function ProductPhotoPreview({
  product,
  sizes,
}: {
  product: Product;
  sizes: string;
}) {
  const photo = product.productImages?.[0];

  return (
    <div
      className="relative aspect-[16/9] overflow-hidden border-b border-line bg-white"
      role={photo ? undefined : "img"}
      aria-label={photo ? undefined : `Product photo not provided for ${product.brandName}`}
    >
      {photo ? (
        <Image
          src={photo.src}
          alt={`${photo.label} product packaging`}
          fill
          sizes={sizes}
          className="object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
        />
      ) : null}
    </div>
  );
}
