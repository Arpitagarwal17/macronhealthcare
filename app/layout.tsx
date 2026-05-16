import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Macron Health Care",
  description: "Macron Health Care official product and company website.",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "LocalBusiness", "MedicalBusiness"],
      "@id": `${company.websiteUrl}/#organization`,
      name: company.displayName,
      legalName: company.displayName,
      url: company.websiteUrl,
      logo: `${company.websiteUrl}/logo.png`,
      image: `${company.websiteUrl}/logo.png`,
      slogan: company.tagline,
      foundingDate: company.servingSince,
      email: company.email,
      telephone: company.contactNumbers,
      areaServed: "India",
      employee: {
        "@type": "Person",
        name: company.director,
        jobTitle: "Company Director",
      },
      address: [
        {
          "@type": "PostalAddress",
          name: "Registered Office",
          streetAddress:
            "S.P.O.: 2, Nanawati Society, 1st Floor, Ambrai Bari",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        {
          "@type": "PostalAddress",
          name: "Jaipur Depot / Operational Address",
          streetAddress:
            "78, Basement Floor, SBBJ Officer's Colony, New Sanganer Road, Near Mansarovar Metro Station",
          addressLocality: "Jaipur",
          postalCode: "302020",
          addressCountry: "IN",
        },
      ],
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
      "@type": "WebSite",
      "@id": `${company.websiteUrl}/#website`,
      url: company.websiteUrl,
      name: company.displayName,
      publisher: {
        "@id": `${company.websiteUrl}/#organization`,
      },
      inLanguage: "en",
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
