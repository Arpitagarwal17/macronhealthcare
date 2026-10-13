"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Suspense, type ComponentProps } from "react";
import {
  catalogueProductHref,
  catalogueReturnHref,
  contextualProductHref,
  productBackHref,
  productBackLabel,
  productCounterpartHref,
  type ProductRouteBase,
} from "@/lib/productNavigation";

type NavigationProps = {
  routeBase: ProductRouteBase;
  slug: string;
};

type ContextLinkProps = NavigationProps & Omit<ComponentProps<typeof Link>, "href">;

function ResolvedCatalogProductLink({ routeBase, slug, ...props }: ContextLinkProps) {
  const searchParams = useSearchParams();
  return <Link {...props} href={catalogueProductHref(routeBase, slug, searchParams.toString())} />;
}

export function CatalogProductLink({ routeBase, slug, ...props }: ContextLinkProps) {
  return (
    <Suspense fallback={<Link {...props} href={catalogueProductHref(routeBase, slug)} />}>
      <ResolvedCatalogProductLink {...props} routeBase={routeBase} slug={slug} />
    </Suspense>
  );
}

type BackLinkProps = NavigationProps & { fallbackLabel: string };

function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="secondary-button min-h-10 px-4">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

function ResolvedDetailBackLink({ routeBase, slug, fallbackLabel }: BackLinkProps) {
  const searchParams = useSearchParams();
  const href = productBackHref(routeBase, slug, searchParams.get("returnTo"));
  return <BackLink href={href} label={productBackLabel(href, fallbackLabel)} />;
}

export function ProductDetailBackLink(props: BackLinkProps) {
  return (
    <Suspense fallback={<BackLink href={catalogueReturnHref(props.routeBase, props.slug)} label={props.fallbackLabel} />}>
      <ResolvedDetailBackLink {...props} />
    </Suspense>
  );
}

function CounterpartLink({ href, routeBase }: { href: string; routeBase: ProductRouteBase }) {
  return (
    <Link href={href} className="secondary-button w-full">
      {routeBase === "/product-portfolio" ? "View Visual Aid" : "View Product"}
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </Link>
  );
}

function ResolvedCounterpartLink({ routeBase, slug }: NavigationProps) {
  const searchParams = useSearchParams();
  const href = productCounterpartHref(routeBase, slug, searchParams.get("returnTo"));
  return <CounterpartLink href={href} routeBase={routeBase} />;
}

export function ProductCounterpartLink(props: NavigationProps) {
  return (
    <Suspense fallback={<CounterpartLink href={productCounterpartHref(props.routeBase, props.slug, null)} routeBase={props.routeBase} />}>
      <ResolvedCounterpartLink {...props} />
    </Suspense>
  );
}

function ResolvedContextLink({ routeBase, slug, ...props }: ContextLinkProps) {
  const searchParams = useSearchParams();
  return <Link {...props} href={contextualProductHref(routeBase, slug, searchParams.get("returnTo"))} />;
}

export function ProductContextLink({ routeBase, slug, ...props }: ContextLinkProps) {
  return (
    <Suspense fallback={<Link {...props} href={contextualProductHref(routeBase, slug, null)} />}>
      <ResolvedContextLink {...props} routeBase={routeBase} slug={slug} />
    </Suspense>
  );
}
