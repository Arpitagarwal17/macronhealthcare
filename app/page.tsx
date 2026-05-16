import Image from "next/image";
import Link from "next/link";
import { company } from "@/data/company";

const HOME_HERO_IMAGE = "/homepage-hero-pharma.png";

export default function HomePage() {
  return (
    <div>
      <section className="page-shell py-10 sm:py-14 lg:py-16">
        <div className="home-hero premium-panel overflow-hidden">
          <div className="relative z-10 grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-2 lg:px-14 lg:py-16">
            <div className="max-w-3xl space-y-7">
              <p className="field-label text-blue">At Your Service Since 1999</p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl lg:text-6xl">
                  {company.displayName}
                </h1>
                <p className="max-w-xl text-lg font-semibold leading-7 text-teal">
                  {company.tagline}
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

            <div className="relative min-h-[260px] overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/40 shadow-soft sm:min-h-[340px] lg:min-h-[430px]">
              <Image
                src={HOME_HERO_IMAGE}
                alt="Macron Health Care pharmaceutical products"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
