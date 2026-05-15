import { productDownloads } from "@/data/downloads";
import { getProductCategory } from "@/data/productCategories";
import { products, type Product } from "@/data/products";

export const metadata = {
  title: "Product List / Card | Macron Health Care",
};

const productListCategories = [
  "Tablets",
  "Capsules",
  "Dry Syrups",
  "Syrups",
  "Injections",
  "Miscellaneous",
] as const;

type ProductListCategory = (typeof productListCategories)[number];

type ProductListItem = Product & {
  productListCategory: ProductListCategory;
};

function getProductListCategory(product: Product): ProductListCategory {
  const broadCategory = getProductCategory(product.dosageForm);

  if (
    broadCategory === "Tablets" ||
    broadCategory === "Capsules" ||
    broadCategory === "Dry Syrups" ||
    broadCategory === "Syrups" ||
    broadCategory === "Injections"
  ) {
    return broadCategory;
  }

  return "Miscellaneous";
}

const sortedProducts = [...products].sort((first, second) =>
  first.brandName.localeCompare(second.brandName, undefined, {
    sensitivity: "base",
  }),
);

const productSections = productListCategories
  .map((category) => ({
    category,
    products: sortedProducts
      .map<ProductListItem>((product) => ({
        ...product,
        productListCategory: getProductListCategory(product),
      }))
      .filter((product) => product.productListCategory === category),
  }))
  .filter((section) => section.products.length > 0);

const sustainedReleaseDsrSlugs = new Set([
  "myorab-dsr",
  "ppzol-dsr",
  "rabiday-dsr",
  "rabron-dsr",
]);

function getOptionalBadge(product: Product, category: ProductListCategory) {
  const dosageForm = product.dosageForm.trim();
  const normalized = dosageForm.toLowerCase();

  if (sustainedReleaseDsrSlugs.has(product.slug)) {
    return "Sustained Release Capsules";
  }

  if (!dosageForm || normalized.includes("to be added")) {
    return null;
  }

  if (category === "Tablets" && /^(tablet|tablets)$/i.test(dosageForm)) {
    return null;
  }

  if (category === "Capsules" && /^(capsule|capsules)$/i.test(dosageForm)) {
    return null;
  }

  if (category === "Syrups" && /^(syrup|syrups)$/i.test(dosageForm)) {
    return null;
  }

  return dosageForm;
}

export default function ProductListPage() {
  const downloads = [productDownloads.productCard, productDownloads.productList];

  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="field-label text-blue">Macron Health Care</p>
            <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Product List / Card
            </h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:min-w-[540px]">
            {downloads.map((item) => (
              <article
                key={item.label}
                className="rounded-[1rem] border border-line bg-white p-4 shadow-soft"
              >
                <p className="field-label text-blue">{item.label}</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-blue/20 bg-white px-4 text-sm font-semibold text-blue transition duration-200 hover:border-blue hover:bg-porcelain focus:outline-none focus:ring-4 focus:ring-blue/10"
                  >
                    View {item.label}
                  </a>
                  <a
                    href={item.href}
                    download={item.fileName}
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-blue px-4 text-sm font-semibold text-white shadow-soft transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/15"
                  >
                    {item.buttonLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-9">
          {productSections.map((section) => (
            <section key={section.category} className="space-y-4">
              <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
                <h2 className="text-2xl font-semibold text-ink">
                  {section.category}
                </h2>
                <span className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-slate">
                  {section.products.length}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product) => {
                  const badge = getOptionalBadge(product, section.category);

                  return (
                    <article
                      key={product.slug}
                      className="flex min-h-[150px] flex-col gap-3 rounded-[1.1rem] border border-line bg-white p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-blue/25 hover:shadow-premium sm:p-5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <h3 className="break-words text-xl font-semibold leading-tight text-blue sm:text-2xl">
                          {product.brandName}
                        </h3>
                        {badge ? (
                          <span className="rounded-full border border-teal/20 bg-teal/10 px-3 py-1 text-xs font-semibold leading-5 text-teal">
                            {badge}
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-1.5">
                        <p className="break-words text-[15px] leading-7 text-slate [overflow-wrap:anywhere] sm:text-base">
                          {product.composition}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
