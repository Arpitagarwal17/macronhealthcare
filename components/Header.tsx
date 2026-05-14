import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Brands" },
  { href: "/info", label: "Company Info" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white">
      <div className="page-shell flex flex-col items-center justify-between gap-4 py-4 lg:min-h-24 lg:flex-row lg:py-0">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Macron Health Care"
            width={308}
            height={105}
            priority
            unoptimized
            className="h-auto w-56 sm:w-64"
          />
        </Link>
        <nav className="grid w-full max-w-[320px] min-w-0 grid-cols-2 gap-1 overflow-hidden rounded-lg border border-line bg-paper p-1 shadow-soft sm:max-w-[420px] sm:grid-cols-4 lg:w-auto lg:max-w-none">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-w-0 rounded-md px-1 py-2 text-center text-xs font-semibold text-slate transition hover:bg-white hover:text-blue sm:text-[13px] lg:px-4 lg:text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
