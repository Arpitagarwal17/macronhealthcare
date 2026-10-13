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
      aria-label="Product catalogue navigation"
      className="flex flex-col gap-4 rounded-3xl border border-line bg-porcelain px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="eyebrow">
          {isPortfolio ? "Prepare a presentation" : "Explore the products"}
        </p>
        <p className="mt-1 text-sm leading-6 text-slate">
          {isPortfolio
            ? "Select visual aids and create a presentation from your basket."
            : "View product photos, compositions and the latest portfolio documents."}
        </p>
      </div>
      <Link
        href={isPortfolio ? "/doctor-presentation" : "/product-portfolio"}
        className="secondary-button min-h-11 shrink-0 self-start px-4 sm:self-center"
      >
        {isPortfolio ? "Visual Aid Portfolio" : "Product Portfolio"}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
