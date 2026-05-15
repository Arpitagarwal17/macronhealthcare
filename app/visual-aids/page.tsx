import { redirect } from "next/navigation";

export const metadata = {
  title: "Doctor Presentation | Macron Health Care",
};

export default function VisualAidsRedirectPage() {
  redirect("/doctor-presentation");
}
