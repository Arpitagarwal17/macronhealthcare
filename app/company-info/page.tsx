import CompanyInfoContent from "@/components/CompanyInfoContent";
import { pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: "Company Information | Macron Health Care",
  description:
    "Learn about Macron Health Care, GST details, address, contact information, and pharmaceutical distribution services in Jaipur.",
  path: "/company-info",
});

export default function CompanyInfoPage() {
  return <CompanyInfoContent />;
}
