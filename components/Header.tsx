"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/product-list", label: "Product Portfolio" },
  { href: "/doctor-presentation", label: "Doctor Presentation" },
  { href: "/info", label: "Company Info" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="page-shell py-3 lg:flex lg:min-h-24 lg:items-center lg:justify-between lg:gap-6 lg:py-0">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex w-fit items-center">
            <Image
              src="/logo.png"
              alt="Macron Health Care"
              width={246}
              height={100}
              priority
              unoptimized
              className="h-12 w-auto max-w-[190px] object-contain sm:h-14 sm:max-w-[230px] lg:h-[4.5rem] lg:max-w-[285px]"
            />
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper text-blue shadow-soft transition hover:border-blue focus:outline-none focus:ring-4 focus:ring-blue/10 lg:hidden"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        <nav
          className={`mt-3 grid w-full min-w-0 gap-1 overflow-hidden rounded-lg border border-line bg-paper p-1 shadow-soft lg:mt-0 lg:w-auto lg:min-w-[760px] lg:grid-cols-5 ${
            isMenuOpen ? "grid" : "hidden lg:grid"
          }`}
        >
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`min-w-0 rounded-md px-3 py-3 text-center text-sm font-semibold transition lg:px-3 lg:py-2.5 ${
                  isActive
                    ? "bg-blue text-white shadow-soft"
                    : "text-slate hover:bg-white hover:text-blue"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
