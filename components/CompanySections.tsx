import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Eye, HeartHandshake, ShieldCheck, Stethoscope, Target } from "lucide-react";
import styles from "./CompanySections.module.css";

const principles = [
  { id: "mission", title: "Our mission", icon: Target, text: "To contribute to better healthcare through responsible work, meaningful relationships and dependable service." },
  { id: "vision", title: "Our vision", icon: Eye, text: "A future shaped by understanding, trust and respect for every person receiving care." },
  { id: "values", title: "Our values", icon: HeartHandshake, text: "Integrity in our decisions. Empathy in our outlook. Respect for every person." },
];

export function CompanyPrinciples() {
  return (
    <section className={`${styles.section} ${styles.softSection}`} aria-labelledby="principles-heading">
      <div className="page-shell">
        <div className={styles.sectionIntro} data-reveal>
          <p className="eyebrow">Our principles</p>
          <h2 id="principles-heading" className={styles.heading}>What guides us.</h2>
        </div>
        <div className={styles.principleGrid}>
          {principles.map(({ id, title, icon: Icon, text }, index) => (
            <article id={id} key={id} className={styles.principleCard} data-reveal={String(index)}>
              <span className={styles.principleIcon}><Icon size={29} strokeWidth={1.6} aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function QualityCommitment({ showLink = true }: { showLink?: boolean }) {
  return (
    <section id="quality" className={styles.section} aria-labelledby="quality-heading">
      <div className={`page-shell ${styles.qualityGrid}`}>
        <div className={styles.careVisual} data-reveal>
          <Image
            src="/macron-doctor-patient-trust-hero-2026.webp"
            alt="Illustrative photograph of a doctor listening to a patient"
            fill
            sizes="(min-width: 1280px) 570px, (min-width: 768px) 44vw, calc(100vw - 40px)"
            className={styles.careImage}
          />
        </div>
        <div data-reveal="1">
          <p className="eyebrow">For patients and doctors</p>
          <h2 id="quality-heading" className={styles.heading}>Healthcare is a shared responsibility.</h2>
          <p className={styles.copy}>We respect the expertise of doctors and the dignity of patients. These values guide the way we work.</p>
          <ul className={styles.qualityList}>
            <li><HeartHandshake size={23} aria-hidden="true" /><div><h3>Patients as people</h3><p>An outlook grounded in empathy, dignity and respect.</p></div></li>
            <li><Stethoscope size={23} aria-hidden="true" /><div><h3>Respect for doctors</h3><p>We value independent clinical judgement and the responsibility behind each decision.</p></div></li>
            <li><ShieldCheck size={23} aria-hidden="true" /><div><h3>Responsible service</h3><p>We aim to act with integrity, listen carefully and build lasting professional relationships.</p></div></li>
          </ul>
          {showLink && <Link href="/about#quality" className={`secondary-button ${styles.button}`}>Our approach <ArrowUpRight size={18} aria-hidden="true" /></Link>}
        </div>
      </div>
    </section>
  );
}
