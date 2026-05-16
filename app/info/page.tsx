import { company } from "@/data/company";

export const metadata = {
  title: "Company Info | Macron Health Care",
};

export default function InfoPage() {
  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="premium-panel p-7 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="space-y-7">
            <div className="space-y-4">
              <p className="field-label text-blue">Company Information</p>
              <h1 className="text-4xl font-semibold text-ink">
                {company.displayName}
              </h1>
              <p className="text-lg font-semibold leading-7 text-blue">
                {company.tagline}
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <InfoBlock label="Company Director" value={company.director} />
            <InfoBlock label="Serving Since" value={company.servingSince} />
            <InfoBlock label="Commitment" value="Quality and Services" />
            <InfoBlock label="Website / Domain" value={company.website} />
            <InfoBlock label="Email" value={company.email} />
            <InfoBlock
              label="Contact Numbers"
              value={company.contactNumbers.join("\n")}
            />
            {company.registrations.map((item) => (
              <InfoBlock key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {company.addresses.map((address) => (
          <div key={address.label} className="rounded-[1.1rem] border border-line bg-white p-6 shadow-soft">
            <p className="field-label">{address.label}</p>
            <address className="mt-3 not-italic leading-7 text-slate">
              {address.lines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        ))}
      </div>
    </section>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-line bg-paper p-5">
      <p className="field-label">{label}</p>
      <p className="mt-3 whitespace-pre-line break-words text-base font-semibold leading-7 text-ink">
        {value}
      </p>
    </div>
  );
}
