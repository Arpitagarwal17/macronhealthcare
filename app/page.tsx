import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Phone,
} from "lucide-react";
import { company } from "@/data/company";
import {
  getProductCategory,
  productCategories,
  type ProductCategory,
} from "@/data/productCategories";
import { products } from "@/data/products";
import { HOME_DESCRIPTION, HOME_TITLE, pageMetadata } from "@/data/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
});

const categoryRepresentativeSlugs: Record<ProductCategory, string> = {
  Tablets: "curix-200",
  Capsules: "rabron-dsr",
  Syrups: "lycron-syrup",
  "Dry Syrups": "macron-cv-457",
  Injections: "molly-forte-injection",
  Miscellaneous: "macron-oil-60-ml",
};

const findProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

const HOME_HERO_IMAGE = "/macron-health-care-pharma-hero-2026.png";
const homeHeroImageUrl = `${company.websiteUrl}${HOME_HERO_IMAGE}`;

const homepageStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${company.websiteUrl}/#website`,
      url: `${company.websiteUrl}/`,
      name: company.displayName,
      alternateName: "Macron Healthcare",
      inLanguage: "en-IN",
      publisher: {
        "@id": `${company.websiteUrl}/#organization`,
      },
    },
    {
      "@type": "WebPage",
      "@id": `${company.websiteUrl}/#webpage`,
      url: `${company.websiteUrl}/`,
      name: HOME_TITLE,
      description: HOME_DESCRIPTION,
      inLanguage: "en-IN",
      isPartOf: {
        "@id": `${company.websiteUrl}/#website`,
      },
      about: {
        "@id": `${company.websiteUrl}/#organization`,
      },
      primaryImageOfPage: {
        "@type": "ImageObject",
        "@id": `${company.websiteUrl}/#primaryimage`,
        url: homeHeroImageUrl,
        contentUrl: homeHeroImageUrl,
        caption: "Macron Health Care pharmaceutical product portfolio",
      },
    },
  ],
};

export default function HomePage() {
  const yearsServing = new Date().getFullYear() - Number(company.servingSince);
  const categoryOverview = productCategories.map((category) => ({
    category,
    count: products.filter(
      (product) => getProductCategory(product.dosageForm) === category,
    ).length,
    representative: findProduct(categoryRepresentativeSlugs[category]),
  }));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <section className="relative isolate min-h-[560px] overflow-hidden bg-blue sm:min-h-[600px] lg:min-h-[620px]">
        <Image
          src={HOME_HERO_IMAGE}
          alt="Macron Health Care pharmaceutical product portfolio"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#063b78]/70" aria-hidden="true" />

        <div className="page-shell relative z-10 flex min-h-[560px] items-center justify-center py-16 text-center sm:min-h-[600px] lg:min-h-[620px]">
          <div className="mx-auto max-w-4xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-[#79d7cf]" aria-hidden="true" />
              Since {company.servingSince}
            </p>
            <h1 className="mt-6 text-[2.85rem] font-extrabold leading-[1.04] text-white sm:text-[4rem] lg:text-[5.25rem]">
              Macron Health Care
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-semibold leading-8 text-white/90 sm:text-2xl">
              {company.tagline}
            </p>

            <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href="/product-portfolio"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-teal px-6 text-sm font-bold text-white shadow-premium transition hover:bg-[#00aaa0] focus:outline-none focus:ring-4 focus:ring-white/25"
              >
                View Product Portfolio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/doctor-presentation"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/45 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-blue focus:outline-none focus:ring-4 focus:ring-white/25"
              >
                Create Doctor Presentation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-blue text-white" aria-label="Years of service">
        <div className="page-shell flex items-center justify-center gap-4 py-6 sm:py-7">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-[#79d7cf]">
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="flex items-baseline gap-3">
            <p className="font-heading text-3xl font-extrabold text-white sm:text-4xl">
              {yearsServing}+
            </p>
            <p className="text-sm font-bold text-white/75 sm:text-base">Years of service</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="page-shell text-center">
          <div className="mx-auto max-w-3xl">
            <p className="field-label text-teal">About us</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              About Macron Health Care
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate">
              Since {company.servingSince}, Macron Health Care has focused on quality,
              dependable service, and professional relationships across the healthcare trade.
              Under the direction of {company.director}, these principles continue to guide the
              company.
            </p>
            <Link href="/company-info" className="secondary-button mt-7">
              Company Information
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-paper py-16 sm:py-20">
        <div className="page-shell">
          <SectionHeading
            eyebrow="Product portfolio"
            title="Our Products"
            description="Browse the current Macron Health Care portfolio by dosage-form category."
          />

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryOverview.map(({ category, count, representative }) => (
              <Link
                key={category}
                href={`/product-portfolio?category=${encodeURIComponent(category)}`}
                className="group overflow-hidden rounded-lg border border-line bg-white shadow-soft transition duration-200 hover:-translate-y-1 hover:border-teal/45 hover:shadow-premium"
              >
                <div className="relative aspect-[16/9] border-b border-line bg-white">
                  {representative ? (
                    <Image
                      src={representative.visualAidImage}
                      alt={`${category} products from Macron Health Care`}
                      fill
                      sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, calc(100vw - 40px)"
                      className="object-contain p-2 transition duration-300 group-hover:scale-[1.015]"
                    />
                  ) : null}
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <h3 className="text-xl font-extrabold text-ink transition group-hover:text-blue">
                      {category}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-slate">
                      {count} {count === 1 ? "product" : "products"}
                    </p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-porcelain text-blue transition group-hover:bg-teal group-hover:text-white">
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-5 border-y border-line bg-white px-5 py-6 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-xl font-extrabold text-ink">Complete Product Portfolio</h3>
              <p className="mt-1 text-sm leading-6 text-slate">
                View all products and access the Product Card and updated MRP List 2026.
              </p>
            </div>
            <Link href="/product-portfolio" className="primary-button shrink-0">
              View All Products
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20">
        <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-14">
          <div className="max-w-xl">
            <p className="field-label text-teal">For healthcare professionals</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-5xl">
              Doctor Presentation
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate">
              Open Macron Health Care product visual aids and prepare a presentation from the current portfolio.
            </p>
            <Link href="/doctor-presentation" className="primary-button mt-7">
              Open Doctor Presentation
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <Link
            href="/doctor-presentation"
            aria-label="Open Macron Health Care Doctor Presentation"
            className="group relative aspect-[16/9] overflow-hidden rounded-lg border border-line bg-white shadow-premium"
          >
            <Image
              src="/visual-aid-cover-home.webp"
              alt="Macron Health Care visual aid presentation cover"
              fill
              loading="eager"
              unoptimized
              sizes="(min-width: 1024px) 58vw, calc(100vw - 40px)"
              className="object-contain transition duration-300 group-hover:scale-[1.01]"
            />
          </Link>
        </div>
      </section>

      <section className="bg-blue py-12 text-white sm:py-14">
        <div className="page-shell flex flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
          <div className="max-w-2xl">
            <p className="field-label text-[#79d7cf]">Business enquiries</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
              Connect with Macron Health Care
            </h2>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={company.contactLinks.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={company.contactLinks.phone.href}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-white/30 bg-white px-5 text-sm font-bold text-blue transition hover:bg-porcelain focus:outline-none focus:ring-4 focus:ring-white/20"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="field-label text-teal">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-5xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-slate sm:text-lg">{description}</p>
    </div>
  );
}
