import Link from "next/link";

type BasketFloatingButtonProps = {
  count: number;
};

export default function BasketFloatingButton({
  count,
}: BasketFloatingButtonProps) {
  return (
    <>
      <div className="fixed inset-x-3 bottom-3 z-30 rounded-[1rem] border border-blue/15 bg-white p-3 shadow-premium sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-ink">
            Basket: {count} {count === 1 ? "product" : "products"}
          </span>
          <Link
            href="/basket"
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-blue px-4 text-sm font-semibold text-white transition hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/20"
            aria-label={`Open presentation basket with ${count} selected products`}
          >
            View Basket
          </Link>
        </div>
      </div>

      <Link
        href="/basket"
        className="fixed bottom-6 right-6 z-30 hidden min-h-12 items-center justify-center rounded-full bg-blue px-5 text-sm font-semibold text-white shadow-premium transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/20 sm:inline-flex"
        aria-label={`Open presentation basket with ${count} selected products`}
      >
        Basket ({count})
      </Link>
    </>
  );
}
