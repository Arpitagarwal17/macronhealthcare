import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="page-shell flex flex-col gap-4 py-6 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="inline-flex w-fit items-center">
          <Image
            src="/logo.png"
            alt="Macron Health Care"
            width={220}
            height={75}
            unoptimized
            className="h-auto w-40"
          />
        </Link>
        <p className="font-semibold text-ink">{company.brandLines[0]}</p>
      </div>
    </footer>
  );
}
