import Image from "next/image";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { Globe2, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="page-shell grid gap-8 py-10 text-sm text-slate sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-mark.png"
              alt="Macron Health Care"
              width={56}
              height={65}
              unoptimized
              className="h-12 w-auto"
            />
            <span>
              <span className="block text-lg font-semibold text-ink">
                {company.displayName}
              </span>
              <span className="mt-1 block text-xs font-semibold text-blue">
                {company.brandLines[0]}.
              </span>
            </span>
          </Link>
          <div className="space-y-2 leading-6">
            <p>{company.brandLines[1]}</p>
            <p>
              <span className="font-semibold text-ink">Company Director:</span>{" "}
              {company.director}
            </p>
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Contact</h2>
          <div className="mt-4 space-y-3">
            {company.contactNumbers.map((number) => (
              <FooterLink key={number} href={`tel:${number}`} icon={<Phone />}>
                {number}
              </FooterLink>
            ))}
            <FooterLink href={`mailto:${company.email}`} icon={<Mail />}>
              {company.email}
            </FooterLink>
            <FooterLink href={`https://${company.website}`} icon={<Globe2 />}>
              {company.website}
            </FooterLink>
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Registrations</h2>
          <div className="mt-4 space-y-3">
            {company.registrations.map((item) => (
              <p key={item.label} className="leading-6">
                <span className="block font-semibold text-ink">{item.label}</span>
                <span>{item.value}</span>
              </p>
            ))}
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Addresses</h2>
          <div className="mt-4 space-y-4">
            {company.addresses.map((address) => (
              <div key={address.label} className="flex gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-blue" aria-hidden="true" />
                <address className="not-italic leading-6">
                  <span className="block font-semibold text-ink">{address.label}</span>
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-line bg-paper/70">
        <div className="page-shell py-4 text-sm font-semibold text-ink">
          {company.displayName} - {company.brandLines[0]}.
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: ReactElement;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 break-words font-semibold text-ink transition hover:text-blue"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-blue [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span>{children}</span>
    </a>
  );
}
