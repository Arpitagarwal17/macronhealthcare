import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Mail, MessageCircle, Phone } from "lucide-react";
import { company } from "@/data/company";
import { productCategories } from "@/data/productCategories";
import CurrentYear from "@/components/CurrentYear";
import styles from "./Footer.module.css";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/product-portfolio", label: "Products" },
  { href: "/doctor-presentation", label: "Doctor Presentation" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`page-shell ${styles.columns}`}>
        <div className={styles.aboutPanel}>
          <Link href="/" aria-label="Macron Health Care home" className={styles.logo}>
            <Image
              src="/logo.png"
              alt="Macron Health Care logo"
              width={220}
              height={89}
              sizes="156px"
              className={styles.logoImage}
            />
          </Link>
          <h2 className={styles.aboutHeading}>About Macron</h2>
          <p className={styles.aboutCopy}>Committed to quality and services since 1999.</p>
          <Link href="/about" className={styles.aboutLink}>Know our company <span aria-hidden="true"><ArrowUpRight size={16} /></span></Link>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>Quick Links</h2>
          <nav aria-label="Footer navigation" className={styles.linkList}>
            {footerLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.textLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>Our Products</h2>
          <nav aria-label="Product categories" className={styles.linkList}>
            {productCategories.map((category) => (
              <Link key={category} href={`/product-portfolio?category=${encodeURIComponent(category)}`} className={styles.textLink}>
                {category}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.column}>
          <h2 className={styles.heading}>Contact Us</h2>
          <div className={styles.contacts}>
            <a href={company.contactLinks.phone.href} aria-label={company.contactLinks.phone.ariaLabel} className={styles.contactLink}>
              <Phone size={16} aria-hidden="true" />
              <span>{company.contactLinks.phone.display}</span>
            </a>
            <a href={company.contactLinks.email.href} aria-label={company.contactLinks.email.ariaLabel} className={styles.contactLink}>
              <Mail size={16} aria-hidden="true" />
              <span>{company.contactLinks.email.display}</span>
            </a>
            <a href={company.contactLinks.whatsapp.href} aria-label={company.contactLinks.whatsapp.ariaLabel} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              <MessageCircle size={16} aria-hidden="true" />
              <span>WhatsApp us</span>
            </a>
          </div>
          <div className={styles.addresses}>
            {company.addresses.map((address) => (
              <div key={address.label}>
                <h3>{address.label}</h3>
                <address>
                  {address.lines.map((line) => <span key={line}>{line}</span>)}
                </address>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBorder}>
        <div className={`page-shell ${styles.bottom}`}>
          <p>© <CurrentYear /> {company.displayName}. All rights reserved.</p>
          <Link href="/company-info" className={styles.textLink}>Company Information <ArrowUpRight size={14} aria-hidden="true" /></Link>
        </div>
      </div>
    </footer>
  );
}
