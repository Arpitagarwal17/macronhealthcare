import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company } from "@/data/company";
import {
  absoluteUrl,
  HOME_TITLE,
  OG_DESCRIPTION,
  OG_IMAGE,
  OG_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
} from "@/data/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: "%s",
  },
  description:
    "Macron Health Care is a trusted pharmaceutical distributor and supplier in Jaipur, Rajasthan, committed to quality and services since 1999. View product portfolio, company details, GST information, and contact details.",
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    url: absoluteUrl("/"),
    siteName: company.displayName,
    type: "website",
    images: [
      {
        url: absoluteUrl(OG_IMAGE),
        alt: "Macron Health Care logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    images: [absoluteUrl(OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const jaipurAddress = {
  "@type": "PostalAddress",
  streetAddress:
    "78, Basement Floor, SBBJ Officer's Colony, New Sanganer Road, Near Mansarovar Metro Station",
  addressLocality: "Jaipur",
  addressRegion: "Rajasthan",
  postalCode: "302020",
  addressCountry: "IN",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${company.websiteUrl}/#organization`,
      name: company.displayName,
      alternateName: "Macron Healthcare",
      legalName: company.displayName,
      url: company.websiteUrl,
      logo: `${company.websiteUrl}/logo.png`,
      image: `${company.websiteUrl}/logo.png`,
      slogan: company.tagline,
      foundingDate: company.servingSince,
      email: company.email,
      telephone: company.contactNumbers[0],
      identifier: "08AJTPG1414G1ZB",
      areaServed: "India",
      employee: {
        "@type": "Person",
        name: company.director,
        jobTitle: "Company Director",
      },
      address: jaipurAddress,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "GSTIN",
          value: "08AJTPG1414G1ZB",
        },
        {
          "@type": "PropertyValue",
          name: "D.L. No.",
          value: "DRUG/2019-20/31520-21",
        },
        {
          "@type": "PropertyValue",
          name: "Food Lic. No.",
          value: "12219026001541",
        },
      ],
    },
    {
      "@type": "LocalBusiness",
      "@id": `${company.websiteUrl}/#localbusiness`,
      name: company.displayName,
      alternateName: "Macron Healthcare",
      url: company.websiteUrl,
      logo: `${company.websiteUrl}/logo.png`,
      image: `${company.websiteUrl}/logo.png`,
      telephone: company.contactNumbers[0],
      email: company.email,
      priceRange: "$$",
      address: jaipurAddress,
      parentOrganization: {
        "@id": `${company.websiteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
