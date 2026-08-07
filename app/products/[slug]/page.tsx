import { permanentRedirect } from "next/navigation";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  permanentRedirect(`/product-portfolio/${slug}`);
}
