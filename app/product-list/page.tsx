import ProductDownloadPanel from "@/components/ProductDownloadPanel";
import { getProductCategory } from "@/data/productCategories";
import { products, type Product } from "@/data/products";

export const metadata = {
  title: "Product List | Macron Health Care",
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

export default function ProductListPage() {
  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 space-y-5">
          <div className="space-y-3">
            <p className="field-label text-blue">Product List</p>
            <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Macron Health Care Product List
            </h1>
          </div>

          <ProductDownloadPanel />
        </div>

        <div className="space-y-10">
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

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.products.map((product) => (
                  <article
                    key={product.slug}
                    className="flex min-h-[250px] flex-col gap-4 rounded-[1.1rem] border border-line bg-white p-5 shadow-soft"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="break-words text-2xl font-semibold leading-tight text-blue">
                        {product.brandName}
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <p className="field-label">Composition</p>
                      <p className="break-words text-[15px] leading-7 text-slate [overflow-wrap:anywhere]">
                        {product.composition}
                      </p>
                    </div>

                    <div className="mt-auto grid gap-3 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="field-label">Dosage Form</p>
                        <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold leading-5 text-teal">
                          {product.dosageForm}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="field-label">Category</p>
                        <span className="inline-flex max-w-full rounded-full border border-blue/15 bg-porcelain px-3 py-1 text-sm font-semibold leading-5 text-blue">
                          {section.category}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
