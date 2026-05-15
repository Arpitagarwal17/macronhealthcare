import Link from "next/link";
import { company } from "@/data/company";

const homeFacts = [
  { label: "Serving Since", value: company.servingSince },
  { label: "Company Director", value: company.director },
  { label: "Commitment", value: "Quality and Services" },
];

export default function HomePage() {
  return (
    <div>
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="home-hero premium-panel overflow-hidden">
          <div className="relative z-10 grid items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[0.88fr_1.12fr] lg:px-14 lg:py-16">
            <div className="max-w-2xl space-y-8">
              <div className="space-y-5">
                <p className="field-label text-blue">At Your Service Since 1999</p>
                <h1 className="max-w-[12ch] text-4xl font-semibold leading-tight text-ink sm:max-w-3xl sm:text-5xl lg:text-6xl">
                  Macron Health Care
                </h1>
                <p className="max-w-2xl text-xl font-semibold leading-8 text-blue">
                  Committed to Quality and Services
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/products" className="primary-button">
                  Explore Brands
                </Link>
                <Link href="/contact" className="secondary-button">
                  Contact
                </Link>
              </div>
            </div>

            <div className="home-pharma-visual" aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="page-shell pb-12 sm:pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {homeFacts.map((item) => (
            <CompanyCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CompanyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-line bg-white p-6 shadow-soft">
      <p className="field-label">{label}</p>
      <p className="mt-3 break-words text-lg font-semibold text-ink">{value}</p>
    </div>
  );
}
