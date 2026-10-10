import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company } from "@/data/company";
import styles from "./HeritageSection.module.css";

export default function HeritageSection() {
  return (
    <section className={styles.section} aria-labelledby="heritage-heading">
      <div className={`page-shell ${styles.layout}`}>
        <div className={styles.headingBlock} data-reveal>
          <p className={styles.since}>Since {company.servingSince}</p>
          <h2 id="heritage-heading" className={styles.heading}>
            A legacy of quality and service.
          </h2>
        </div>

        <div className={styles.copyBlock} data-reveal="1">
          <p className={styles.copy}>
            Our story continues with integrity in our work and respect for the people we serve.
          </p>
          <Link href="/about" className={`secondary-button ${styles.storyLink}`}>
            Our story <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
