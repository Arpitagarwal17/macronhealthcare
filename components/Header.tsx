"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/product-list", label: "Product List / Card" },
  { href: "/visual-aids", label: "Visual Aids" },
  { href: "/info", label: "Company Info" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <div className="page-shell flex flex-col gap-4 py-4 xl:min-h-24 xl:flex-row xl:items-center xl:justify-between xl:py-0">
        <Link href="/" className="inline-flex w-fit items-center">
          <Image
            src="/logo.png"
            alt="Macron Health Care"
            width={246}
            height={100}
            priority
            unoptimized
            className="h-16 w-auto max-w-[245px] object-contain sm:h-[4.5rem] sm:max-w-[285px]"
          />
        </Link>
        <nav className="grid w-full min-w-0 grid-cols-2 gap-1 overflow-hidden rounded-lg border border-line bg-paper p-1 shadow-soft sm:grid-cols-3 lg:grid-cols-5 xl:w-auto xl:min-w-[690px]">
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
                className={`min-w-0 rounded-md px-2 py-2.5 text-center text-xs font-semibold transition sm:text-[13px] lg:px-3 xl:text-sm ${
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
