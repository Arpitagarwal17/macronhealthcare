import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company } from "@/data/company";
import ContactBand from "@/components/ContactBand";
import PageMotion from "@/components/PageMotion";
import { CompanyPrinciples, QualityCommitment } from "@/components/CompanySections";
import styles from "./about.module.css";

const DESCRIPTION = "Meet Macron Health Care, an Indian pharmaceutical company led by Mr. RB Gupta, and explore its range of branded formulations.";

export const metadata: Metadata = {
  title: "About Us",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: "About Us | Macron Health Care", description: DESCRIPTION },
};

export default function AboutPage() {
  return (
    <PageMotion className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org", "@type": "AboutPage", name: "About Macron Health Care",
        url: `${company.websiteUrl}/about`, description: DESCRIPTION,
        about: { "@id": `${company.websiteUrl}/#organization` },
      }).replace(/</g, "\\u003c") }} />

      <section className={styles.intro} aria-labelledby="about-heading">
        <div className="page-shell">
          <div className={styles.masthead}>
            <h1 id="about-heading" className={styles.title}>About us</h1>
            <p className={styles.introLead}>The people and principles behind our portfolio.</p>
          </div>
          <div className={styles.introGrid}>
            <div className={styles.imageFrame}>
              <Image
                src="/images/macron-medical-dialogue-v3.webp"
                alt="Illustrative photograph of two doctors reviewing a reference book"
                fill
                priority
                sizes="(min-width: 1280px) 590px, (min-width: 768px) 48vw, calc(100vw - 40px)"
                className={styles.partnershipImage}
              />
            </div>
            <div className={styles.storyBody}>
              <p className={styles.eyebrow}>Macron Health Care</p>
              <h2 id="our-company-heading" className={styles.sectionTitle}>An Indian pharmaceutical company.</h2>
              <p>Our range includes tablets, capsules, syrups, dry syrups, drops, injections and other dosage forms.</p>
              <p>Our team focuses on dependable service and clear communication.</p>
              <div className={styles.storyFoot}>
                <div className={styles.director}>
                  <span className={styles.directorName}>{company.director}</span>
                  <span>Company Director</span>
                </div>
                <Link href="/product-portfolio" className={styles.textLink}>Our products <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CompanyPrinciples />
      <QualityCommitment showLink={false} />

      <ContactBand />
    </PageMotion>
  );
}
