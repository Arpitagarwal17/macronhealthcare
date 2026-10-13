import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Visual Aid Portfolio",
};

export default function VisualAidsRedirectPage() {
  permanentRedirect("/doctor-presentation");
}
