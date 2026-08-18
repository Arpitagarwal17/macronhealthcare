import Link from "next/link";
import { ShoppingBasket } from "lucide-react";

type BasketFloatingButtonProps = {
  count: number;
};

export default function BasketFloatingButton({
  count,
}: BasketFloatingButtonProps) {
  if (count === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-[calc(0.75rem+env(safe-area-inset-left))] right-[calc(0.75rem+env(safe-area-inset-right))] z-30 rounded-xl border border-blue/15 bg-white/95 p-3 shadow-premium backdrop-blur-xl sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">
            Basket: {count} {count === 1 ? "product" : "products"}
          </span>
          <Link
            href="/basket"
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue px-4 text-sm font-bold text-white transition hover:bg-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60"
            aria-label={`Open presentation basket with ${count} selected products`}
          >
            <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            View Basket
          </Link>
        </div>
      </div>

      <Link
        href="/basket"
        className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-30 hidden min-h-12 items-center justify-center gap-2 rounded-full bg-blue px-5 text-sm font-bold text-white shadow-premium transition duration-200 hover:-translate-y-0.5 hover:bg-teal focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 sm:inline-flex"
        aria-label={`Open presentation basket with ${count} selected products`}
      >
        <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
        Basket ({count})
      </Link>
    </>
  );
}
