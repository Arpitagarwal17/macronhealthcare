import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Product Portfolio",
};

export default function ProductsPage() {
  permanentRedirect("/product-portfolio");
}
