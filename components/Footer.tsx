import Image from "next/image";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { FileText, Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { company } from "@/data/company";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#062f5d] text-white">
      <div className="page-shell grid gap-9 py-12 text-sm text-white/75 sm:grid-cols-2 lg:grid-cols-[0.8fr_0.9fr_0.9fr_1.35fr] lg:gap-10">
        <div className="space-y-4">
          <Link href="/" className="inline-flex w-fit items-center rounded-lg bg-white p-2">
            <Image
              src="/logo.png"
              alt="Macron Health Care logo"
              width={220}
              height={89}
              unoptimized
              className="h-12 w-auto max-w-[190px] object-contain"
            />
          </Link>
          <div className="space-y-2 leading-6">
            <p className="font-bold text-white">
              Serving the healthcare trade since {company.servingSince}
            </p>
            <p>
              <span className="font-bold text-white">Company Director:</span>{" "}
              {company.director}
            </p>
          </div>
          <Link
            href="/company-info"
            className="inline-flex font-bold text-[#79d7cf] transition hover:text-white"
          >
            Company Information
          </Link>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">Contact</h2>
          <div className="mt-4 space-y-3">
            <FooterContactLink
              icon={<MessageCircle />}
              label="WhatsApp"
              href={company.contactLinks.whatsapp.href}
              ariaLabel={company.contactLinks.whatsapp.ariaLabel}
              target="_blank"
              rel="noopener noreferrer"
            >
              {company.contactLinks.whatsapp.display}
            </FooterContactLink>
            <FooterContactLink
              icon={<Phone />}
              label="Phone"
              href={company.contactLinks.phone.href}
              ariaLabel={company.contactLinks.phone.ariaLabel}
            >
              {company.contactLinks.phone.display}
            </FooterContactLink>
            <FooterContactLink
              icon={<Mail />}
              label="Email"
              href={company.contactLinks.email.href}
              ariaLabel={company.contactLinks.email.ariaLabel}
            >
              {company.contactLinks.email.display}
            </FooterContactLink>
            <FooterContactLink
              icon={<Globe2 />}
              label="Website"
              href={company.contactLinks.website.href}
              ariaLabel={company.contactLinks.website.ariaLabel}
            >
              {company.contactLinks.website.display}
            </FooterContactLink>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">Registrations</h2>
          <div className="mt-4 space-y-3">
            {company.registrations.map((item) => (
              <FooterBlock key={item.label} icon={<FileText />} label={item.label}>
                <p className="break-words font-semibold leading-6 text-white/85">
                  {item.value}
                </p>
              </FooterBlock>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-heading text-base font-bold text-white">Addresses</h2>
          <div className="mt-4 space-y-4">
            {company.addresses.map((address) => (
              <FooterBlock key={address.label} icon={<MapPin />} label={address.label}>
                <address className="not-italic leading-6 text-white/70">
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
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-col gap-2 py-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Macron Health Care. All rights reserved.</p>
          <p>Products intended for trade and healthcare professionals.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterContactLink({
  icon,
  label,
  href,
  ariaLabel,
  target,
  rel,
  children,
}: {
  icon: ReactElement;
  label: string;
  href: string;
  ariaLabel: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={target}
      rel={rel}
      className="flex gap-3 rounded-lg py-1 text-white/80 transition hover:text-white focus:outline-none focus:ring-4 focus:ring-white/15"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#79d7cf] [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 break-words leading-6">
        <span className="font-bold text-white">{label}:</span> {children}
      </span>
    </a>
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
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#79d7cf] [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="mb-1 font-bold text-white">{label}</p>
        {children}
      </div>
    </div>
  );
}
