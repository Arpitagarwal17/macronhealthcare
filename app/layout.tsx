import type { Metadata, Viewport } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import NativeBackButton from "@/components/NativeBackButton";
import { company } from "@/data/company";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  OG_DESCRIPTION,
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
    template: "%s | Macron Health Care",
  },
  description: HOME_DESCRIPTION,
  authors: [{ name: company.displayName, url: company.websiteUrl }],
  creator: company.displayName,
  publisher: company.displayName,
  category: "Pharmaceutical company",
  keywords: SEO_KEYWORDS,
  openGraph: {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    siteName: company.displayName,
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: OG_TITLE,
    description: OG_DESCRIPTION,
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
      { url: "/favicon-48x48.png?v=2", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png?v=2", sizes: "96x96", type: "image/png" },
    ],
    shortcut: "/favicon.ico?v=2",
    apple: "/apple-touch-icon.png?v=2",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#063B78",
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
  "@type": "Organization",
  "@id": `${company.websiteUrl}/#organization`,
  name: company.displayName,
  alternateName: "Macron Healthcare",
  legalName: company.name,
  url: company.websiteUrl,
  logo: `${company.websiteUrl}/logo.png`,
  image: `${company.websiteUrl}/logo.png`,
  description: HOME_DESCRIPTION,
  slogan: company.tagline,
  foundingDate: company.servingSince,
  email: company.email,
  telephone: company.contactNumbers[0],
  identifier: company.registrations[0].value,
  taxID: company.registrations[0].value,
  areaServed: {
    "@type": "Country",
    name: "India",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: company.contactNumbers[0],
    email: company.email,
    contactType: "customer service",
    areaServed: {
      "@type": "Country",
      name: "India",
    },
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
      name: company.registrations[0].label,
      value: company.registrations[0].value,
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
          <ServiceWorkerRegistration />
          <NativeBackButton />
        </div>
      </body>
    </html>
  );
}
