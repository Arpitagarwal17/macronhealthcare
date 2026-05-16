import Image from "next/image";
import Link from "next/link";
import type { ReactElement, ReactNode } from "react";
import { FileText, Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
      className="flex gap-3 rounded-lg py-1 text-ink transition hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-blue [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 break-words leading-6">
        <span className="font-semibold">{label}:</span> {children}
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
