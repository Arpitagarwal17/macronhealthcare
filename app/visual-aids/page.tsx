import { permanentRedirect } from "next/navigation";

export const metadata = {
  title: "Doctor Presentation",
};

export default function VisualAidsRedirectPage() {
  permanentRedirect("/doctor-presentation");
}
