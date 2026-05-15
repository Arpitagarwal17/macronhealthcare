import Link from "next/link";

type BasketFloatingButtonProps = {
  count: number;
};

export default function BasketFloatingButton({
  count,
}: BasketFloatingButtonProps) {
  return (
    <Link
      href="/basket"
      className="fixed bottom-4 right-4 z-30 inline-flex min-h-12 items-center justify-center rounded-full bg-blue px-5 text-sm font-semibold text-white shadow-premium transition duration-200 hover:bg-teal focus:outline-none focus:ring-4 focus:ring-blue/20 sm:bottom-6 sm:right-6"
      aria-label={`Open presentation basket with ${count} selected products`}
    >
      Basket ({count})
    </Link>
  );
}
