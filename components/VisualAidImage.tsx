import Image from "next/image";

type VisualAidImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

export default function VisualAidImage({
  src,
  alt,
  priority = false,
  className = "",
  imageClassName = "",
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
}: VisualAidImageProps) {
  return (
    <div className={`relative min-w-0 overflow-hidden bg-white ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={`object-contain ${imageClassName}`}
      />
    </div>
  );
}
