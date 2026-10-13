import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./CatalogHeader.module.css";

type CatalogHeaderProps = {
  current: "portfolio" | "presentation";
};

export default function CatalogHeader({ current }: CatalogHeaderProps) {
  const isPortfolio = current === "portfolio";

  return (
    <header className={styles.header}>
      <div className={styles.copy}>
        <h1 className={styles.title}>
          {isPortfolio ? "Product Portfolio" : "Visual Aid Portfolio"}
        </h1>
        <p className={styles.description}>
          {isPortfolio
            ? "Browse product photos, compositions and dosage forms."
            : "Browse visual aids and create a product presentation."}
        </p>
      </div>
      <Link
        href={isPortfolio ? "/doctor-presentation" : "/product-portfolio"}
        className={styles.crossLink}
      >
        {isPortfolio ? "Visual Aid Portfolio" : "Product Portfolio"}
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </header>
  );
}
