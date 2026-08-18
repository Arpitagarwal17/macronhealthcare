import Link from "next/link";
import { ArrowRight } from "lucide-react";

type CatalogAudienceBannerProps = {
  current: "portfolio" | "presentation";
};

export default function CatalogAudienceBanner({
  current,
}: CatalogAudienceBannerProps) {
  const isPortfolio = current === "portfolio";

  return (
    <aside
      aria-label="Choose the right product catalogue"
      className="flex flex-col gap-4 rounded-xl border border-blue/15 bg-porcelain px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="field-label text-tealDark">
          {isPortfolio ? "For trade and chemists" : "For HCP presentations"}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate">
          {isPortfolio
            ? "Browse brand, composition, dosage form, and portfolio documents."
            : "Select visual aids and build a focused detailing basket."}
        </p>
      </div>
      <Link
        href={isPortfolio ? "/doctor-presentation" : "/product-portfolio"}
        className="inline-flex min-h-10 shrink-0 items-center gap-2 self-start text-sm font-extrabold text-blue transition hover:text-tealDark focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 sm:self-center"
      >
        {isPortfolio ? "Open Doctor Presentation" : "Browse Product Portfolio"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
