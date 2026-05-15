"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company } from "@/data/company";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Brands" },
  { href: "/info", label: "Company Info" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="page-shell flex flex-col gap-4 py-4 lg:min-h-24 lg:flex-row lg:items-center lg:justify-between lg:py-0">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-mark.png"
            alt="Macron Health Care"
            width={64}
            height={75}
            priority
            unoptimized
            className="h-14 w-auto sm:h-16"
          />
          <span className="min-w-0">
            <span className="block text-xl font-semibold leading-tight text-ink sm:text-2xl">
              {company.displayName}
            </span>
            <span className="mt-1 block text-xs font-semibold leading-tight text-blue sm:text-sm">
              {company.brandLines[0]}.
            </span>
          </span>
        </Link>
        <nav className="grid w-full min-w-0 grid-cols-2 gap-1 overflow-hidden rounded-lg border border-line bg-paper p-1 shadow-soft sm:grid-cols-4 lg:w-auto lg:min-w-[500px]">
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
                className={`min-w-0 rounded-md px-2 py-2.5 text-center text-xs font-semibold transition sm:text-[13px] lg:px-4 lg:text-sm ${
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
