import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { company } from "@/data/company";
import {
  absoluteUrl,
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_DESCRIPTION,
  OG_IMAGE,
  OG_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
} from "@/data/seo";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: company.displayName,
  title: {
    default: HOME_TITLE,
    template: "%s",
  },
  description: HOME_DESCRIPTION,
  authors: [{ name: company.displayName, url: company.websiteUrl }],
  creator: company.displayName,
  publisher: company.displayName,
  category: "Pharmaceutical distribution",
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
    locale: "en_IN",
    images: [
      {
        url: absoluteUrl(OG_IMAGE),
        alt: "Macron Health Care pharmaceutical distribution and product portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
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
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=2", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

const registeredAddress = {
  "@type": "PostalAddress",
  streetAddress:
    "S.P.O.: 2, Nanawati Society, 1st Floor, Ambrai Bari",
  addressLocality: "Ahmedabad",
  addressRegion: "Gujarat",
  addressCountry: "IN",
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
      description: HOME_DESCRIPTION,
      slogan: company.tagline,
      foundingDate: company.servingSince,
      email: company.email,
      telephone: company.contactNumbers[0],
      identifier: "08AJTPG1414G1ZB",
      taxID: "08AJTPG1414G1ZB",
      areaServed: "India",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: company.contactNumbers[0],
        email: company.email,
        contactType: "business enquiries",
      },
      employee: {
        "@type": "Person",
        name: company.director,
        jobTitle: "Company Director",
      },
      address: [registeredAddress, jaipurAddress],
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "GSTIN",
          value: "08AJTPG1414G1ZB",
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
      description: HOME_DESCRIPTION,
      slogan: company.tagline,
      foundingDate: company.servingSince,
      telephone: company.contactNumbers[0],
      email: company.email,
      taxID: "08AJTPG1414G1ZB",
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
      <body className={`${manrope.variable} ${sourceSans.variable}`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </div>
      </body>
    </html>
  );
}
