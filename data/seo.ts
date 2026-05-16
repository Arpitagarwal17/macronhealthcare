import type { Metadata } from "next";
import { company } from "@/data/company";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.macronhealthcare.com";

export const SEO_KEYWORDS = [
  "Macron Health Care",
  "Macron Healthcare",
  "pharmaceutical distributor in Jaipur",
  "pharma supplier in Jaipur",
  "medicine distributor Jaipur",
  "healthcare products Jaipur",
  "pharmaceutical supplier Rajasthan",
];

export const HOME_TITLE =
  "Macron Health Care | Pharmaceutical Distributor in Jaipur | Since 1999";

export const HOME_DESCRIPTION =
  "Macron Health Care is a trusted pharmaceutical distributor and supplier in Jaipur, Rajasthan, committed to quality and services since 1999.";

export const OG_TITLE =
  "Macron Health Care | Pharmaceutical Distributor in Jaipur";

export const OG_DESCRIPTION =
  "Trusted pharmaceutical distributor and supplier in Jaipur, Rajasthan, committed to quality and services since 1999.";

export const OG_IMAGE = "/logo.png";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image = OG_IMAGE,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    keywords: SEO_KEYWORDS,
    alternates: {
      canonical: absoluteUrl(path),
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: company.displayName,
      type: "website",
      images: [
        {
          url: absoluteUrl(image),
          alt: "Macron Health Care logo",
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [absoluteUrl(image)],
    },
  };
}
