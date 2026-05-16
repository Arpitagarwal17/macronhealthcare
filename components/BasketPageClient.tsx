"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  exportBasketAsPdf,
  exportBasketAsPpt,
  openMobileExportWindow,
} from "@/components/exportBasket";
import type { Product } from "@/data/products";
import PresentationViewer from "@/components/PresentationViewer";
import { useBasket } from "@/components/useBasket";

type BasketPageClientProps = {
  products: Product[];
};

export default function BasketPageClient({ products }: BasketPageClientProps) {
  const { slugs, count, isReady, removeProduct, clearBasket, replaceBasket } =
    useBasket();
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "ppt" | null>(null);
  const [exportError, setExportError] = useState("");
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 140,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const productBySlug = useMemo(
    () => new Map(products.map((product) => [product.slug, product])),
    [products],
  );

  const selectedProducts = useMemo(
    () =>
      slugs
        .map((slug) => productBySlug.get(slug))
        .filter((product): product is Product => Boolean(product)),
    [productBySlug, slugs],
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const validSlugs = slugs.filter((slug) => productBySlug.has(slug));

    if (validSlugs.length !== slugs.length) {
      replaceBasket(validSlugs);
    }
  }, [isReady, productBySlug, replaceBasket, slugs]);

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setIsPresentationOpen(false);
    }
  }, [selectedProducts.length]);

  const orderedProductSlugs = selectedProducts.map((product) => product.slug);
  const isActionDisabled = selectedProducts.length === 0 || exporting !== null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedProductSlugs.indexOf(String(active.id));
    const newIndex = orderedProductSlugs.indexOf(String(over.id));

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    replaceBasket(arrayMove(orderedProductSlugs, oldIndex, newIndex));
  };

  const handleExport = async (type: "pdf" | "ppt") => {
    if (selectedProducts.length === 0 || exporting) {
      return;
    }

    setExporting(type);
    setExportError("");
    const fallbackWindow = openMobileExportWindow();

    try {
      if (type === "pdf") {
        await exportBasketAsPdf(selectedProducts, fallbackWindow);
      } else {
        await exportBasketAsPpt(selectedProducts, fallbackWindow);
      }
    } catch (error) {
      fallbackWindow?.close();
      setExportError(
        error instanceof Error
          ? error.message
          : "Export could not be created. Please try again.",
      );
    } finally {
      setExporting(null);
    }
  };

  return (
    <section className="page-shell py-10 sm:py-12">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="field-label text-blue">Basket</p>
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Presentation Basket
            </h1>
          </div>

          <Link href="/doctor-presentation" className="secondary-button lg:min-w-36">
            Back to Doctor Presentation
          </Link>
        </div>

        {selectedProducts.length > 0 ? (
          <>
            <div className="mb-6 rounded-[1.1rem] border border-line bg-white p-4 shadow-soft sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm font-semibold text-slate">
                  Export selected products to share with doctor.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <button
                    type="button"
                    onClick={() => setIsPresentationOpen(true)}
                    disabled={isActionDisabled}
                    className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Start PPT View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("pdf")}
                    disabled={isActionDisabled}
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-blue/20 bg-white px-5 text-sm font-semibold text-blue shadow-soft transition duration-200 hover:border-blue hover:bg-porcelain focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {exporting === "pdf" ? "Preparing export..." : "Export PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("ppt")}
                    disabled={isActionDisabled}
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-blue/20 bg-white px-5 text-sm font-semibold text-blue shadow-soft transition duration-200 hover:border-blue hover:bg-porcelain focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {exporting === "ppt" ? "Preparing export..." : "Export PPT"}
                  </button>
                  <button
                    type="button"
                    onClick={clearBasket}
                    disabled={count === 0 || exporting !== null}
                    className="inline-flex min-h-12 items-center justify-center rounded-md border border-line bg-white px-5 text-sm font-semibold text-ink shadow-soft transition duration-200 hover:border-blue hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10 disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Clear Basket
                  </button>
                </div>
              </div>

              {exportError ? (
                <p className="mt-3 text-sm font-semibold text-red-700">
                  {exportError}
                </p>
              ) : null}
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedProductSlugs}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {selectedProducts.map((product) => (
                    <SortableBasketCard
                      key={product.slug}
                      product={product}
                      onRemove={removeProduct}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </>
        ) : (
          <div className="rounded-[1.1rem] border border-line bg-white p-8 text-center shadow-soft">
            <p className="text-xl font-semibold text-ink">
              Your presentation basket is empty.
            </p>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate">
              Add products from Doctor Presentation to create a quick presentation.
            </p>
            <Link href="/doctor-presentation" className="primary-button mt-5">
              Go to Doctor Presentation
            </Link>
          </div>
        )}
      </div>

      {isPresentationOpen ? (
        <PresentationViewer
          products={selectedProducts}
          onClose={() => setIsPresentationOpen(false)}
        />
      ) : null}
    </section>
  );
}

function SortableBasketCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (slug: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.slug });
  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  };

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`grid gap-4 rounded-[1.1rem] border bg-white p-4 shadow-soft transition-shadow sm:grid-cols-[44px_140px_minmax(0,1fr)_120px] sm:items-center ${
        isDragging
          ? "border-blue/50 shadow-premium"
          : "border-line"
      }`}
    >
      <button
        type="button"
        aria-label={`Drag ${product.brandName} to reorder`}
        className="flex h-11 w-11 touch-none items-center justify-center rounded-md border border-line bg-paper text-blue transition hover:border-blue hover:bg-white focus:outline-none focus:ring-4 focus:ring-blue/10 sm:self-center"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[0.85rem] border border-line bg-white">
        <Image
          src={product.visualAidImage}
          alt={`${product.brandName} Macron Health Care product visual aid`}
          fill
          sizes="140px"
          className="object-contain p-2"
        />
      </div>

      <div className="min-w-0 space-y-3">
        <h2 className="break-words text-2xl font-semibold leading-tight text-ink">
          {product.brandName}
        </h2>
        <div className="space-y-1">
          <p className="field-label">Composition</p>
          <p className="break-words text-[15px] leading-7 text-slate [overflow-wrap:anywhere]">
            {product.composition}
          </p>
        </div>
        <div className="space-y-1">
          <p className="field-label">Dosage Form</p>
          <span className="inline-flex max-w-full rounded-full border border-teal/25 bg-teal/10 px-3 py-1 text-sm font-semibold leading-5 text-blue">
            {product.dosageForm}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(product.slug)}
        className="inline-flex min-h-10 items-center justify-center rounded-md border border-line bg-paper px-4 text-sm font-semibold text-slate transition hover:border-blue hover:bg-white hover:text-blue focus:outline-none focus:ring-4 focus:ring-blue/10"
      >
        Remove
      </button>
    </article>
  );
}
