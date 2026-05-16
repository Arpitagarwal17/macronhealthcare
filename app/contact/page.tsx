import { Globe2, Mail, MapPin, Phone } from "lucide-react";
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

        <div className="grid gap-5 lg:grid-cols-3">
          <ContactCard icon={<Phone />} label="Contact Numbers">
            <div className="space-y-2">
              {company.contactNumbers.map((mobile) => (
                <a
                  key={mobile}
                  href={`tel:${mobile}`}
                  className="block text-lg font-semibold text-ink hover:text-blue"
                >
                  {mobile}
                </a>
              ))}
            </div>
          </ContactCard>

          <ContactCard icon={<Mail />} label="Email">
            <a
              href={`mailto:${company.email}`}
              className="break-words text-lg font-semibold text-ink hover:text-blue"
            >
              {company.email}
            </a>
          </ContactCard>

          <ContactCard icon={<Globe2 />} label="Website">
            <a
              href={`https://${company.website}`}
              className="break-words text-lg font-semibold text-ink hover:text-blue"
            >
              {company.website}
            </a>
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
