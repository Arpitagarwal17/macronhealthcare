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
          <div className="relative z-10 grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_0.72fr] lg:px-14 lg:py-16">
            <div className="max-w-3xl space-y-7">
              <p className="field-label text-blue">At Your Service Since 1999</p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  Macron Health Care
                </h1>
                <p className="max-w-xl text-lg font-semibold leading-7 text-teal">
                  Committed to Quality and Services
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/product-list" className="primary-button">
                  View Product Portfolio
                </Link>
                <Link href="/doctor-presentation" className="secondary-button">
                  Create Doctor Presentation
                </Link>
              </div>
            </div>

            <div className="grid content-center gap-4">
              {homeFacts.map((item) => (
                <CompanyCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
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
