import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

const HOME_HERO_IMAGE = "/homepage-hero-pharma.png";

export default function HomePage() {
  return (
    <div>
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="home-hero premium-panel overflow-hidden">
          <div className="relative z-10 grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:px-14 lg:py-16">
            <div className="max-w-3xl space-y-8">
              <div className="space-y-5">
                <h1 className="text-[2.125rem] font-semibold leading-[1.05] text-ink sm:text-[2.75rem] lg:whitespace-nowrap lg:text-[3.25rem] xl:text-[3.75rem]">
                  {company.displayName}
                </h1>
                <div className="space-y-4">
                  <p className="max-w-xl text-lg font-semibold leading-7 text-teal sm:text-xl">
                    {company.tagline}
                  </p>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#bfe8e8] bg-[linear-gradient(135deg,#ffffff_0%,#eaf8f8_100%)] px-[18px] py-2.5 text-sm font-bold leading-none tracking-[0.3px] text-[#0f2d4f] shadow-[0_8px_22px_rgba(15,45,79,0.10)]">
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 rounded-full bg-[#009c9c] shadow-[0_0_0_4px_rgba(0,156,156,0.12)]"
                    />
                    Since {company.servingSince}
                  </span>
                </div>
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

            <div className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/40 shadow-soft sm:min-h-[380px] lg:min-h-[450px]">
              <Image
                src={HOME_HERO_IMAGE}
                alt="Macron Health Care pharmaceutical products"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-[72%_center]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
