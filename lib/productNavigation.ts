export type ProductRouteBase = "/product-portfolio" | "/doctor-presentation";

const NAVIGATION_ORIGIN = "https://catalogue.invalid";
const MAX_RETURN_LENGTH = 8192;
const ROUTE_PATTERN = /^\/(product-portfolio|doctor-presentation)(?:\/([a-z0-9]+(?:-[a-z0-9]+)*))?\/?$/;
const FILTER_KEYS = ["q", "category", "therapeutic"] as const;

type NavigationTarget = {
  url: URL;
  routeBase: ProductRouteBase;
  slug?: string;
};

function parseTarget(value: string | null | undefined): NavigationTarget | null {
  if (
    !value ||
    value.length > MAX_RETURN_LENGTH ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020\u007f]/.test(value)
  ) {
    return null;
  }

  try {
    const url = new URL(value, NAVIGATION_ORIGIN);
    const match = url.pathname.match(ROUTE_PATTERN);
    if (url.origin !== NAVIGATION_ORIGIN || !match || (match[2]?.length ?? 0) > 100) {
      return null;
    }
    return { url, routeBase: `/${match[1]}` as ProductRouteBase, slug: match[2] };
  } catch {
    return null;
  }
}

function catalogueTarget(target: NavigationTarget): string {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = target.url.searchParams.get(key);
    if (value) params.set(key, value);
  }
  const search = params.toString();
  const hash = /^#product-[a-z0-9]+(?:-[a-z0-9]+)*$/.test(target.url.hash)
    ? target.url.hash
    : "";
  return `${target.routeBase}${search ? `?${search}` : ""}${hash}`;
}

/** Keep at most one detail return, with one catalogue return beneath it. */
export function sanitizeProductReturnTo(value: string | null | undefined): string | null {
  const target = parseTarget(value);
  if (!target) return null;
  if (!target.slug) return catalogueTarget(target);

  const pathname = `${target.routeBase}/${target.slug}`;
  const parent = parseTarget(target.url.searchParams.get("returnTo"));
  if (!parent || parent.slug) return pathname;
  return detailHref(target.routeBase, target.slug, catalogueTarget(parent));
}

export function productCardId(slug: string): string {
  return `product-${slug}`;
}

export function catalogueReturnHref(
  routeBase: ProductRouteBase,
  slug: string,
  search = "",
): string {
  const target = parseTarget(`${routeBase}${search ? `?${search.replace(/^\?/, "")}` : ""}`);
  const catalogue = target ? catalogueTarget(target).split("#")[0] : routeBase;
  return `${catalogue}#${productCardId(slug)}`;
}

function detailHref(routeBase: ProductRouteBase, slug: string, returnTo: string): string {
  const params = new URLSearchParams({ returnTo });
  return `${routeBase}/${slug}?${params}`;
}

function underlyingCatalogue(
  returnTo: string | null | undefined,
  routeBase: ProductRouteBase,
  slug: string,
): string {
  const safeReturn = sanitizeProductReturnTo(returnTo);
  const target = parseTarget(safeReturn);
  if (!target) return catalogueReturnHref(routeBase, slug);
  if (!target.slug) return catalogueTarget(target);
  const parent = parseTarget(target.url.searchParams.get("returnTo"));
  return parent && !parent.slug
    ? catalogueTarget(parent)
    : catalogueReturnHref(routeBase, slug);
}

export function catalogueProductHref(
  routeBase: ProductRouteBase,
  slug: string,
  search = "",
): string {
  return detailHref(routeBase, slug, catalogueReturnHref(routeBase, slug, search));
}

export function productBackHref(
  routeBase: ProductRouteBase,
  slug: string,
  returnTo: string | null | undefined,
): string {
  const safeReturn = sanitizeProductReturnTo(returnTo);
  const target = parseTarget(safeReturn);
  if (target?.routeBase === routeBase && target.slug === slug) {
    return underlyingCatalogue(safeReturn, routeBase, slug);
  }
  return safeReturn ?? catalogueReturnHref(routeBase, slug);
}

export function productCounterpartHref(
  routeBase: ProductRouteBase,
  slug: string,
  returnTo: string | null | undefined,
): string {
  const counterpart: ProductRouteBase = routeBase === "/product-portfolio"
    ? "/doctor-presentation"
    : "/product-portfolio";
  const safeReturn = sanitizeProductReturnTo(returnTo);
  const target = parseTarget(safeReturn);
  if (target?.routeBase === counterpart && target.slug === slug && safeReturn) {
    return safeReturn;
  }
  const currentDetail = detailHref(
    routeBase,
    slug,
    underlyingCatalogue(safeReturn, routeBase, slug),
  );
  return detailHref(counterpart, slug, currentDetail);
}

/** Previous/next/related products retain the original visible catalogue card. */
export function contextualProductHref(
  routeBase: ProductRouteBase,
  slug: string,
  returnTo: string | null | undefined,
): string {
  return detailHref(routeBase, slug, underlyingCatalogue(returnTo, routeBase, slug));
}

export function productBackLabel(href: string, fallbackLabel: string): string {
  const target = parseTarget(href);
  if (!target) return fallbackLabel;
  if (!target.slug) {
    return target.routeBase === "/product-portfolio" ? "Product Portfolio" : "Visual Aid Portfolio";
  }
  return target.routeBase === "/product-portfolio" ? "Back to Product" : "Back to Visual Aid";
}
