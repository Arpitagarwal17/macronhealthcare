import { Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import { company } from "@/data/company";

export const metadata = {
  title: "Contact | Macron Health Care",
};

export default function ContactPage() {
  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 max-w-3xl space-y-3">
          <p className="field-label text-blue">Contact</p>
          <h1 className="text-4xl font-semibold leading-tight text-ink">
            {company.displayName}
          </h1>
          <p className="text-lg font-semibold leading-7 text-blue">
            {company.tagline}.
          </p>
        </div>

        <div className="grid gap-5">
          <ContactCard icon={<Phone />} label="Contact Details">
            <div className="space-y-3">
              <ContactLink
                icon={<MessageCircle />}
                label="WhatsApp"
                href={company.contactLinks.whatsapp.href}
                ariaLabel={company.contactLinks.whatsapp.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                {company.contactLinks.whatsapp.display}
              </ContactLink>
              <ContactLink
                icon={<Phone />}
                label="Phone"
                href={company.contactLinks.phone.href}
                ariaLabel={company.contactLinks.phone.ariaLabel}
              >
                {company.contactLinks.phone.display}
              </ContactLink>
              <ContactLink
                icon={<Mail />}
                label="Email"
                href={company.contactLinks.email.href}
                ariaLabel={company.contactLinks.email.ariaLabel}
              >
                {company.contactLinks.email.display}
              </ContactLink>
              <ContactLink
                icon={<Globe2 />}
                label="Website"
                href={company.contactLinks.website.href}
                ariaLabel={company.contactLinks.website.ariaLabel}
              >
                {company.contactLinks.website.display}
              </ContactLink>
            </div>
          </ContactCard>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {company.addresses.map((address) => (
            <ContactCard key={address.label} icon={<MapPin />} label={address.label}>
              <address className="not-italic leading-7 text-slate">
                {address.lines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </ContactCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactLink({
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
      className="flex gap-3 rounded-lg py-1 text-lg text-ink transition hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-blue [&_svg]:h-4 [&_svg]:w-4">
        {icon}
      </span>
      <span className="min-w-0 break-words leading-7">
        <span className="font-semibold">{label}:</span> {children}
      </span>
    </a>
  );
}

function ContactCard({
  icon,
  label,
  children,
}: {
  icon: ReactElement;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.1rem] border border-line bg-white p-6 shadow-soft">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-blue [&_svg]:h-5 [&_svg]:w-5">
          {icon}
        </span>
        <p className="field-label text-blue">{label}</p>
      </div>
      {children}
    </div>
  );
}
