import {
  BadgeCheck,
  CalendarDays,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
} from "lucide-react";
import type { ReactElement } from "react";
import { company } from "@/data/company";

export default function CompanyInfoContent() {
  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="field-label text-teal">Company information</p>
        <h1 className="mt-3 text-4xl font-extrabold text-ink sm:text-5xl">
          {company.displayName}
        </h1>
        <p className="mt-4 text-lg font-semibold leading-8 text-blue">
          {company.tagline}
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <InfoCard icon={<UserRound />} label="Company Director" value={company.director} />
        <InfoCard icon={<CalendarDays />} label="Serving Since" value={company.servingSince} />
        <InfoCard icon={<BadgeCheck />} label="Commitment" value="Quality and Services" />
        <InfoCard
          icon={<Phone />}
          label="Contact Number"
          value={company.contactLinks.phone.display}
          href={company.contactLinks.phone.href}
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-2xl font-extrabold text-ink">Contact channels</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<MessageCircle />}
              label="WhatsApp"
              value={company.contactLinks.whatsapp.display}
              href={company.contactLinks.whatsapp.href}
              external
            />
            <InfoCard
              icon={<Mail />}
              label="Email"
              value={company.contactLinks.email.display}
              href={company.contactLinks.email.href}
            />
            <InfoCard
              icon={<Globe2 />}
              label="Website"
              value={company.contactLinks.website.display}
              href={company.contactLinks.website.href}
            />
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-extrabold text-ink">Registrations</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {company.registrations.map((item) => (
              <InfoCard
                key={item.label}
                icon={<FileText />}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-extrabold text-ink">Business addresses</h2>
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

function InfoCard({
  icon,
  label,
  value,
  href,
  external = false,
}: {
  icon: ReactElement;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const content = (
    <>
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-porcelain text-blue [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </span>
      <p className="mt-4 field-label">{label}</p>
      <p className="mt-2 break-words text-base font-bold leading-6 text-ink">{value}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="surface-card block p-5 transition hover:-translate-y-0.5 hover:border-blue/35"
      >
        {content}
      </a>
    );
  }

  return <article className="surface-card p-5">{content}</article>;
}
