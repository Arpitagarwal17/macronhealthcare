import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFoundPage() {
  return (
    <section className="page-shell flex min-h-[58vh] items-center justify-center py-16 sm:py-24">
      <div className="max-w-2xl text-center">
        <p className="field-label text-teal">404</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate">
          Browse our Product Portfolio or return to the Macron Health Care homepage.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/product-portfolio" className="primary-button">
            Product Portfolio
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/" className="secondary-button">
            <Home className="h-4 w-4" aria-hidden="true" />
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
