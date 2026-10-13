"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Menu, ShoppingBasket, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useBasket } from "@/components/useBasket";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/product-portfolio", label: "Product Portfolio" },
  { href: "/doctor-presentation", label: "Visual Aid Portfolio" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const { count, isReady } = useBasket();
  const basketCount = isReady ? count : 0;
  const showBasket = pathname === "/basket" || pathname.startsWith("/doctor-presentation");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButton.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white pt-[env(safe-area-inset-top)]">
      <div className="page-shell flex min-h-[82px] flex-wrap items-center justify-between gap-x-4 py-3 lg:min-h-[90px] lg:flex-nowrap lg:gap-5 lg:py-0">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          aria-label="Macron Health Care home"
          className="order-1 inline-flex shrink-0 items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4"
        >
          <Image
            src="/logo.png"
            alt="Macron Health Care logo"
            width={246}
            height={100}
            priority
            sizes="(min-width: 1024px) 170px, 150px"
            className="h-auto w-[150px] object-contain lg:w-[170px]"
          />
        </Link>

        <div className={`order-2 flex items-center gap-2 lg:order-3 ${showBasket ? "" : "lg:hidden"}`}>
          {showBasket && (
            <Link
              href="/basket"
              onClick={() => setIsMenuOpen(false)}
              aria-current={pathname === "/basket" ? "page" : undefined}
              aria-label={`Presentation basket with ${basketCount} ${basketCount === 1 ? "product" : "products"}`}
              title="Presentation basket"
              className="relative inline-flex h-11 min-w-11 items-center justify-center rounded-full text-blue transition hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
            >
              <ShoppingBasket className="h-5 w-5" aria-hidden="true" />
              <span
                aria-hidden="true"
                className="absolute right-0 top-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-tealDark px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
              >
                {basketCount}
              </span>
            </Link>
          )}
          <button
            ref={menuButton}
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-controls="primary-navigation"
            aria-expanded={isMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-blue transition hover:bg-porcelain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 lg:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>

        <nav
          id="primary-navigation"
          aria-label="Primary navigation"
          className={`order-3 mt-3 w-full border-t border-line py-3 lg:order-2 lg:ml-auto lg:mt-0 lg:flex lg:w-auto lg:items-center lg:gap-1 lg:border-0 lg:py-0 xl:gap-2 ${isMenuOpen ? "grid gap-1" : "hidden"}`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={isActive ? "page" : undefined}
                className={`relative rounded-full px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 lg:whitespace-nowrap lg:px-3 lg:py-3.5 lg:after:absolute lg:after:inset-x-3 lg:after:bottom-1.5 lg:after:h-0.5 lg:after:rounded-full xl:px-4 ${
                  isActive
                    ? "bg-porcelain text-blue lg:bg-transparent lg:after:bg-teal"
                    : "text-slate hover:bg-paper hover:text-blue"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/contact"
            onClick={() => setIsMenuOpen(false)}
            aria-current={pathname === "/contact" ? "page" : undefined}
            className="group mt-2 inline-flex min-h-11 w-fit items-center justify-center gap-4 rounded-full bg-blue py-1.5 pl-5 pr-1.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-tealDark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-4 lg:ml-3 lg:mt-0 lg:whitespace-nowrap"
          >
            Contact Us
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-colors duration-200 group-hover:bg-white/25" aria-hidden="true"><ArrowUpRight className="h-4 w-4 transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" /></span>
          </Link>
        </nav>

      </div>
    </header>
  );
}
