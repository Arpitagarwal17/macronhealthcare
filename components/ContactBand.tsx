import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function ContactBand() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-20" aria-labelledby="portfolio-band-heading">
      <div className="page-shell">
        <div data-reveal className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-3xl bg-blue px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:gap-12 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-28 -top-40 h-[400px] w-[400px] rounded-full border border-white/[0.07]" aria-hidden="true" />
          <div className="relative">
            <h2 id="portfolio-band-heading" className="max-w-2xl font-heading text-[1.9rem] font-bold leading-[1.2] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.65rem]">Discover our formulations.</h2>
          </div>
          <Link href="/product-portfolio" className="group relative inline-flex min-h-14 w-fit shrink-0 items-center justify-center gap-5 rounded-full bg-white py-2 pl-6 pr-2 text-sm font-semibold text-blue transition-colors duration-200 hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-blue">
            Explore the portfolio
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-tealDark text-white transition-colors duration-200 group-hover:bg-blue" aria-hidden="true"><ArrowUpRight className="h-5 w-5 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
