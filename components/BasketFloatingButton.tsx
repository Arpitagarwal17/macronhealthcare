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
      <div className="surface-card fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-[calc(0.75rem+env(safe-area-inset-left))] right-[calc(0.75rem+env(safe-area-inset-right))] z-30 p-3 sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">
            Basket: {count} {count === 1 ? "product" : "products"}
          </span>
          <Link
            href="/basket"
            className="primary-button min-h-10 shrink-0 px-4"
            aria-label={`Open presentation basket with ${count} selected products`}
          >
            <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
            View Basket
          </Link>
        </div>
      </div>

      <Link
        href="/basket"
        className="primary-button fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1.5rem+env(safe-area-inset-right))] z-30 hidden sm:inline-flex"
        aria-label={`Open presentation basket with ${count} selected products`}
      >
        <ShoppingBasket className="h-4 w-4" aria-hidden="true" />
        Basket ({count})
      </Link>
    </>
  );
}
