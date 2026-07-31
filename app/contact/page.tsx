import { Globe2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { ReactElement } from "react";
import { company } from "@/data/company";
import { pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: "Contact Macron Health Care | Pharmaceutical Distributor Jaipur",
  description:
    "Contact Macron Health Care in Jaipur for pharmaceutical product portfolio, business enquiries, and healthcare product distribution support.",
  path: "/contact",
});

export default function ContactPage() {
  const contactChannels = [
    {
      icon: <MessageCircle />,
      label: "WhatsApp",
      value: company.contactLinks.whatsapp.display,
      href: company.contactLinks.whatsapp.href,
      external: true,
    },
    {
      icon: <Phone />,
      label: "Phone",
      value: company.contactLinks.phone.display,
      href: company.contactLinks.phone.href,
      external: false,
    },
    {
      icon: <Mail />,
      label: "Email",
      value: company.contactLinks.email.display,
      href: company.contactLinks.email.href,
      external: false,
    },
    {
      icon: <Globe2 />,
      label: "Website",
      value: company.contactLinks.website.display,
      href: company.contactLinks.website.href,
      external: false,
    },
  ];

  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="field-label text-teal">Business enquiries</p>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Contact {company.displayName}
        </h1>
        <p className="mt-4 text-lg leading-8 text-slate">
          Reach the Macron Health Care team by WhatsApp, phone, or email.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {contactChannels.map((channel) => (
          <ContactChannel key={channel.label} {...channel} />
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-ink">Our locations</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {company.addresses.map((address) => (
            <article key={address.label} className="surface-card flex gap-4 p-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-porcelain text-blue">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-extrabold text-ink">
                  {address.label}
                </h3>
                <address className="mt-2 not-italic leading-7 text-slate">
                  {address.lines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function ContactChannel({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: ReactElement;
  label: string;
  value: string;
  href: string;
  external: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="surface-card block p-5 transition hover:-translate-y-0.5 hover:border-blue/35 hover:shadow-premium"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-porcelain text-blue [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <p className="mt-4 field-label">{label}</p>
      <p className="mt-2 break-words text-base font-bold leading-6 text-ink">{value}</p>
    </a>
  );
}
