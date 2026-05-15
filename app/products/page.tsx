import { redirect } from "next/navigation";

export const metadata = {
  title: "Visual Aids | Macron Health Care",
};

export default function ProductsPage() {
  redirect("/visual-aids");
}
