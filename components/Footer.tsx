import Image from "next/image";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { FileText, Globe2, Mail, MapPin, Phone } from "lucide-react";
import { company } from "@/data/company";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="page-shell grid gap-8 py-10 text-sm text-slate sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex w-fit items-center">
            <Image
              src="/logo.png"
              alt="Macron Health Care"
              width={220}
              height={89}
              unoptimized
              className="h-14 w-auto max-w-[210px] object-contain"
            />
          </Link>
          <div className="space-y-2 leading-6">
            <p>
              <span className="font-semibold text-ink">At Your Service Since:</span>{" "}
              {company.servingSince}
            </p>
            <p>
              <span className="font-semibold text-ink">Company Director:</span>{" "}
              {company.director}
            </p>
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Contact</h2>
          <div className="mt-4 space-y-5">
            <FooterBlock icon={<Phone />} label="Phone">
              <div className="space-y-1.5">
                {company.contactNumbers.map((number) => (
                  <a
                    key={number}
                    href={`tel:${number}`}
                    className="block break-words font-semibold text-ink transition hover:text-blue"
                  >
                    {number}
                  </a>
                ))}
              </div>
            </FooterBlock>
            <FooterBlock icon={<Mail />} label="Email">
              <a
                href={`mailto:${company.email}`}
                className="block break-words font-semibold text-ink transition hover:text-blue"
              >
                {company.email}
              </a>
            </FooterBlock>
            <FooterBlock icon={<Globe2 />} label="Website">
              <a
                href={`https://${company.website}`}
                className="block break-words font-semibold text-ink transition hover:text-blue"
              >
                {company.website}
              </a>
            </FooterBlock>
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Registrations</h2>
          <div className="mt-4 space-y-3">
            {company.registrations.map((item) => (
              <FooterBlock key={item.label} icon={<FileText />} label={item.label}>
                <p className="break-words font-semibold leading-6 text-ink">
                  {item.value}
                </p>
              </FooterBlock>
            ))}
          </div>
        </div>

        <div>
          <h2 className="field-label text-blue">Addresses</h2>
          <div className="mt-4 space-y-4">
            {company.addresses.map((address) => (
              <FooterBlock key={address.label} icon={<MapPin />} label={address.label}>
                <address className="not-italic leading-6 text-slate">
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </FooterBlock>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterBlock({
  icon,
  label,
  children,
}: {
  icon: ReactElement;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-blue [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="mb-1 font-semibold text-ink">{label}</p>
        {children}
      </div>
    </div>
  );
}
