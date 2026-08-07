import type { Metadata } from "next";
import CompanyInfoContent from "@/components/CompanyInfoContent";

const DESCRIPTION =
  "About Macron Health Care, an Indian pharmaceutical company - company details, registrations, addresses and contact information.";

export const metadata: Metadata = {
  title: "Company Information",
  description: DESCRIPTION,
  alternates: { canonical: "/company-info" },
  openGraph: {
    url: "/company-info",
    title: "Company Information | Macron Health Care",
    description: DESCRIPTION,
  },
};

export default function CompanyInfoPage() {
  return <CompanyInfoContent />;
}
