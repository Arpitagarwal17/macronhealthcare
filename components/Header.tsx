"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBasket, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useBasket } from "@/components/useBasket";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/product-portfolio", label: "Products" },
  { href: "/doctor-presentation", label: "Doctor Presentation" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { count, isReady } = useBasket();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 pt-[env(safe-area-inset-top)] shadow-[0_6px_24px_rgba(16,43,70,0.05)] backdrop-blur-xl">
      <div className="page-shell py-3 lg:flex lg:min-h-20 lg:items-center lg:justify-between lg:gap-5 lg:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex w-fit items-center">
            <Image
              src="/logo.png"
              alt="Macron Health Care logo"
              width={246}
              height={100}
              priority
              sizes="240px"
              className="h-11 w-auto max-w-[180px] object-contain sm:h-12 sm:max-w-[210px] lg:h-14 lg:max-w-[240px]"
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="icon-button lg:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <div
          className={`mt-3 w-full rounded-xl border border-line bg-white p-2 shadow-premium lg:mt-0 lg:flex lg:w-auto lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
            isMenuOpen ? "block" : "hidden lg:flex"
          }`}
        >
          <nav className="grid gap-1 lg:flex lg:items-center" aria-label="Primary navigation">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition lg:py-2.5 ${
                    isActive
                      ? "bg-porcelain text-blue"
                      : "text-slate hover:bg-paper hover:text-blue"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/basket"
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === "/basket" ? "page" : undefined}
            aria-label={`Presentation basket with ${isReady ? count : 0} ${count === 1 ? "product" : "products"}`}
            className="mt-1 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-blue/20 bg-white px-3 text-sm font-bold text-blue shadow-soft transition hover:border-blue hover:bg-porcelain focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 lg:mt-0 lg:w-auto"
          >
            <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            Basket
            <span
              className="inline-flex min-w-6 items-center justify-center rounded-full bg-blue px-1.5 py-0.5 text-xs text-white"
              aria-live="polite"
            >
              {isReady ? count : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
