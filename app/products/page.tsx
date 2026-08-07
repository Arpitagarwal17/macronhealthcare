import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Product Portfolio | Macron Health Care",
};

export default function ProductsPage() {
  permanentRedirect("/product-portfolio");
}
