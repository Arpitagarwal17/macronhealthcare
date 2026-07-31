import type { Metadata } from "next";
import { company } from "@/data/company";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.macronhealthcare.com";

export const SITE_LAST_UPDATED = new Date("2026-08-01T00:00:00+05:30");

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
  "Macron Health Care is a pharmaceutical distributor and healthcare product supplier serving Jaipur and Rajasthan since 1999, committed to quality and services.";

export const OG_TITLE =
  "Macron Health Care | Pharmaceutical Distributor in Jaipur";

export const OG_DESCRIPTION =
  "Pharmaceutical distributor and healthcare product supplier serving Jaipur and Rajasthan since 1999, committed to quality and services.";

export const OG_IMAGE = "/opengraph-image";

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
      locale: "en_IN",
      images: [
        {
          url: absoluteUrl(image),
          alt: "Macron Health Care pharmaceutical distribution and product portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
