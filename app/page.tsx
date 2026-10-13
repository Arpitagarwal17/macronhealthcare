import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import PageMotion from "@/components/PageMotion";
import { QualityCommitment } from "@/components/CompanySections";
import CompanyCore from "@/components/CompanyCore";
import HeritageSection from "@/components/HeritageSection";
import HomeProductCarousel from "@/components/HomeProductCarousel";
import { company } from "@/data/company";
import { productCategories } from "@/data/productCategories";
import { products } from "@/data/products";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/data/seo";
import styles from "./home.module.css";

const HERO_IMAGE = "/images/macron-doctors-hero-v3.webp";
const firstProducts = ["curix-200", "rabron-dsr", "lycron-syrup"];
const featuredProducts = [
  ...firstProducts.flatMap((slug) => products.filter((product) => product.slug === slug)),
  ...products.filter((product) => !firstProducts.includes(product.slug)),
].filter((product) => product.productImages?.length).map(({ slug, brandName, dosageForm, productImages }) => ({
  slug, brandName, dosageForm, productImages,
}));

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/", title: HOME_TITLE, description: HOME_DESCRIPTION },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${company.websiteUrl}/#website`,
      url: `${company.websiteUrl}/`,
      name: company.displayName,
      inLanguage: "en-IN",
      publisher: { "@id": `${company.websiteUrl}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${company.websiteUrl}/#webpage`,
      url: `${company.websiteUrl}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      isPartOf: { "@id": `${company.websiteUrl}/#website` },
      about: { "@id": `${company.websiteUrl}/#organization` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${company.websiteUrl}${HERO_IMAGE}`,
      },
    },
  ],
};

export default function HomePage() {
  return (
    <PageMotion className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <section className={styles.hero} aria-labelledby="home-heading">
        <div className={styles.heroImage}>
          <Image
            src={HERO_IMAGE}
            alt="Illustrative photograph of two doctors discussing information on a tablet"
            width={1774}
            height={887}
            priority
            sizes="(min-width: 1024px) 100vw, (min-width: 640px) 48vw, calc(100vw - 40px)"
            className={styles.heroArtwork}
          />
        </div>
        <div className={`page-shell ${styles.heroShell}`}>
          <div className={styles.heroCopy}>
            <h1 id="home-heading"><span>Behind every prescription,</span><span className={styles.heroAccent}>there is a person.</span></h1>
            <p className={styles.heroDescription}>
              We put patients at the heart of our purpose, with respect for the doctors who care for them.
            </p>
            <div className={styles.heroActions}>
              <Link href="/product-portfolio" className={styles.lightButton}>
                Explore products <span className={styles.buttonIcon}><ArrowUpRight size={18} aria-hidden="true" /></span>
              </Link>
              <Link href="/about" className={styles.heroTextLink}>Our story <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
          </div>
          <a href="#our-company" className={styles.scrollLink}><span className={styles.scrollIcon}><ArrowDown size={16} aria-hidden="true" /></span>Scroll to discover</a>
        </div>
      </section>

      <HeritageSection />
      <CompanyCore />
      <QualityCommitment />

      <section className={styles.portfolio} aria-labelledby="portfolio-heading">
        <div className="page-shell">
          <div className={styles.sectionHeader} data-reveal>
            <div>
              <p className={styles.eyebrow}>Our formulations</p>
              <h2 id="portfolio-heading" className={styles.heading}>Our product portfolio.</h2>
            </div>
            <Link href="/product-portfolio" className={styles.textLink}>View all products <ArrowUpRight size={19} aria-hidden="true" /></Link>
          </div>
          <HomeProductCarousel products={featuredProducts} />
          <div className={styles.categoryBar} aria-label="Browse products by dosage form" data-reveal>
            <p>Browse by dosage form</p>
            <div className={styles.categoryLinks}>
              {productCategories.map((category) => (
                <Link key={category} href={`/product-portfolio?category=${encodeURIComponent(category)}`}>{category}<ArrowUpRight size={13} aria-hidden="true" /></Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="presentation-heading">
        <div className={`page-shell ${styles.resourceGrid}`}>
          <div data-reveal>
            <p className={styles.eyebrow}>Product visual aids</p>
            <h2 id="presentation-heading" className={styles.heading}>Visual Aid Portfolio.</h2>
            <p className={styles.bodyCopy}>Explore visual aids and prepare presentations for doctor visits.</p>
            <Link href="/doctor-presentation" className={styles.darkButton}>Visual Aid Portfolio <span className={styles.buttonIcon}><ArrowUpRight size={18} aria-hidden="true" /></span></Link>
          </div>
          <Link href="/doctor-presentation" className={styles.presentationCard} aria-label="Open Visual Aid Portfolio" data-reveal="1">
            <div className={styles.presentationFrame}>
              <Image src="/visual-aid-cover-home.webp" alt="Macron Health Care visual aid cover" fill sizes="(min-width: 1024px) 640px, 100vw" className="object-contain" />
            </div>
            <div className={styles.presentationCaption}><span>Product visual aids</span><span>View. Select. Present. <ArrowRight size={17} aria-hidden="true" /></span></div>
          </Link>
        </div>
      </section>
    </PageMotion>
  );
}
