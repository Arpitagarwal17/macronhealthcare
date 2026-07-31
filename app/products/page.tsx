import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Doctor Presentation | Macron Health Care",
};

export default function ProductsPage() {
  permanentRedirect("/doctor-presentation");
}
