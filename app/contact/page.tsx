import { company } from "@/data/company";

export const metadata = {
  title: "Contact | Macron Health Care",
};

export default function ContactPage() {
  return (
    <section className="page-shell py-10 sm:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="premium-panel p-7 sm:p-9">
          <div className="space-y-4">
            <p className="field-label text-blue">Contact</p>
            <h1 className="text-4xl font-semibold leading-tight text-ink">
              Macron Health Care
            </h1>
            <p className="text-lg font-semibold leading-7 text-blue">
              {company.brandLines[0]}.
            </p>
          </div>

          <div className="mt-8 grid gap-4 border-t border-line pt-8">
            <div>
              <p className="field-label">Serving Since</p>
              <p className="mt-2 text-lg font-semibold text-ink">{company.servingSince}</p>
            </div>
            <div>
              <p className="field-label">Website</p>
              <p className="mt-2 break-words text-lg font-semibold text-ink">
                {company.website}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[1.1rem] border border-line bg-white p-6 shadow-soft">
            <p className="field-label">Contact Number</p>
            <div className="mt-3 flex flex-wrap gap-3 text-lg font-semibold text-ink">
              {company.contactNumbers.map((mobile) => (
                <a key={mobile} href={`tel:${mobile}`} className="hover:text-blue">
                  {mobile}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-[1.1rem] border border-line bg-white p-6 shadow-soft">
            <p className="field-label">Email</p>
            <a
              href={`mailto:${company.email}`}
              className="mt-3 block break-words text-lg font-semibold text-ink hover:text-blue"
            >
              {company.email}
            </a>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
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
        </div>
      </div>
    </section>
  );
}
