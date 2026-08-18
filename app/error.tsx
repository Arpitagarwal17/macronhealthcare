"use client";

import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell flex min-h-[58vh] items-center justify-center py-16 sm:py-24">
      <div className="max-w-2xl text-center">
        <p className="field-label text-tealDark">Something went wrong</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight text-ink sm:text-6xl">
          We couldn&apos;t load this page
        </h1>
        <p
          className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate"
          role="alert"
        >
          Please try again. If the problem continues, return to the Macron Health
          Care homepage and reopen the page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="primary-button">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
          <Link href="/" className="secondary-button">
            <Home className="h-4 w-4" aria-hidden="true" />
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
