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
import { useRouter, useSearchParams } from "next/navigation";
import {
  CloudDownload,
  Download,
  FileText,
  FolderOpen,
  GripVertical,
  MessageCircle,
  Play,
  Save,
  Trash2,
} from "lucide-react";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { exportBasketAsPdf, exportBasketAsPpt } from "@/components/exportBasket";
import type { Product } from "@/data/products";
import PresentationViewer from "@/components/PresentationViewer";
import { useBasket } from "@/components/useBasket";
import { useSavedBaskets } from "@/components/useSavedBaskets";
import { company, createWhatsAppLink } from "@/data/company";
import {
  getProductImageAlt,
  getTherapeuticArea,
  therapeuticAreas,
} from "@/data/productMeta";
import { cacheVisualAidsOffline } from "@/lib/offlineVisualAids";

const PRESENTATION_HISTORY_KEY = "__macronPresentationViewer";

type BasketPageClientProps = {
  products: Product[];
};

export default function BasketPageClient({ products }: BasketPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slugs, count, isReady, removeProduct, clearBasket, replaceBasket } =
    useBasket();
  const {
    savedBaskets,
    isReady: savedBasketsReady,
    saveBasket,
    deleteBasket,
  } = useSavedBaskets();
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [exporting, setExporting] = useState<"pdf" | "ppt" | null>(null);
  const [exportError, setExportError] = useState("");
  const [exportProgress, setExportProgress] = useState("");
  const [basketName, setBasketName] = useState("");
  const [activeBasketName, setActiveBasketName] = useState("Presentation Basket");
  const [savedBasketMessage, setSavedBasketMessage] = useState("");
  const [offlineProgress, setOfflineProgress] = useState("");
  const [offlineError, setOfflineError] = useState("");
  const [isCachingOffline, setIsCachingOffline] = useState(false);
  const presentationHistoryActive = useRef(false);
  const presentationHistoryClosing = useRef(false);
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

  const sharedItemsParam = searchParams.get("items") ?? "";
  const sharedBasketSlugs = useMemo(
    () =>
      [...new Set(sharedItemsParam.split(",").map((slug) => slug.trim()))].filter(
        (slug) => slug && productBySlug.has(slug),
      ),
    [productBySlug, sharedItemsParam],
  );

  const suggestedBasketName = useMemo(() => {
    if (selectedProducts.length === 0) {
      return "Doctor Visit Set";
    }

    const areaCounts = selectedProducts.reduce<Record<string, number>>(
      (counts, product) => {
        const area = getTherapeuticArea(product);
        counts[area] = (counts[area] ?? 0) + 1;
        return counts;
      },
      {},
    );
    const leadingArea = Object.entries(areaCounts).sort(
      (first, second) => second[1] - first[1],
    )[0]?.[0];

    return leadingArea ? `${leadingArea} Set` : "Doctor Visit Set";
  }, [selectedProducts]);

  const openPresentation = useCallback(() => {
    if (presentationHistoryActive.current) {
      return;
    }

    const currentState =
      window.history.state && typeof window.history.state === "object"
        ? window.history.state
        : {};

    window.history.pushState(
      { ...currentState, [PRESENTATION_HISTORY_KEY]: true },
      "",
      window.location.href,
    );
    presentationHistoryActive.current = true;
    presentationHistoryClosing.current = false;
    setIsPresentationOpen(true);
  }, []);

  const closePresentation = useCallback(() => {
    if (
      presentationHistoryActive.current &&
      window.history.state?.[PRESENTATION_HISTORY_KEY]
    ) {
      if (!presentationHistoryClosing.current) {
        presentationHistoryClosing.current = true;
        window.history.back();
      }
      return;
    }

    presentationHistoryActive.current = false;
    presentationHistoryClosing.current = false;
    setIsPresentationOpen(false);
  }, []);

  useEffect(() => {
    if (window.history.state?.[PRESENTATION_HISTORY_KEY]) {
      const nextState = { ...window.history.state };
      delete nextState[PRESENTATION_HISTORY_KEY];
      window.history.replaceState(nextState, "", window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      const isPresentationEntry = Boolean(
        event.state?.[PRESENTATION_HISTORY_KEY],
      );

      presentationHistoryClosing.current = false;

      if (isPresentationEntry) {
        presentationHistoryActive.current = true;
        setIsPresentationOpen(true);
        return;
      }

      if (presentationHistoryActive.current) {
        presentationHistoryActive.current = false;
        setIsPresentationOpen(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
      closePresentation();
    }
  }, [closePresentation, selectedProducts.length]);

  useEffect(() => {
    if (!isReady || !savedBasketsReady) {
      return;
    }

    const hasSameOrder = (savedSlugs: string[]) =>
      savedSlugs.length === slugs.length &&
      savedSlugs.every((slug, index) => slug === slugs[index]);
    const matchingSavedBasket = Object.entries(savedBaskets).find(
      ([, savedSlugs]) => hasSameOrder(savedSlugs),
    )?.[0];

    setActiveBasketName((currentName) => {
      const activeSavedSlugs = savedBaskets[currentName];
      if (activeSavedSlugs && !hasSameOrder(activeSavedSlugs)) {
        return matchingSavedBasket ?? "Presentation Basket";
      }

      if (currentName === "Presentation Basket" && matchingSavedBasket) {
        return matchingSavedBasket;
      }

      return currentName;
    });
  }, [isReady, savedBaskets, savedBasketsReady, slugs]);

  const orderedProductSlugs = selectedProducts.map((product) => product.slug);
  const isActionDisabled = selectedProducts.length === 0 || exporting !== null;
  const sharedBasketUrl = new URL("/basket", company.websiteUrl);
  sharedBasketUrl.searchParams.set("items", orderedProductSlugs.join(","));
  const shareBasketLink = createWhatsAppLink(
    `Macron Health Care presentation basket: ${selectedProducts
      .map((product) => product.brandName)
      .join(", ")}. Open the basket: ${sharedBasketUrl.toString()}`,
  );

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

  const handleLoadSharedBasket = () => {
    replaceBasket(sharedBasketSlugs);
    setActiveBasketName("Shared Basket");
    setSavedBasketMessage(
      `Loaded shared basket with ${sharedBasketSlugs.length} products.`,
    );
    router.replace("/basket", { scroll: false });
  };

  const handleDismissSharedBasket = () => {
    router.replace("/basket", { scroll: false });
  };

  const handleSaveBasket = () => {
    const name = basketName.trim() || suggestedBasketName;
    if (!name || orderedProductSlugs.length === 0) {
      return;
    }

    if (
      savedBaskets[name] &&
      !window.confirm(`Replace the saved basket “${name}”?`)
    ) {
      return;
    }

    saveBasket(name, orderedProductSlugs);
    setActiveBasketName(name);
    setBasketName("");
    setSavedBasketMessage(`Saved “${name}”.`);
  };

  const handleLoadSavedBasket = (name: string, savedSlugs: string[]) => {
    const validSlugs = savedSlugs.filter((slug) => productBySlug.has(slug));
    replaceBasket(validSlugs);
    setActiveBasketName(name);
    setSavedBasketMessage(`Loaded “${name}” with ${validSlugs.length} products.`);
  };

  const handleDeleteSavedBasket = (name: string) => {
    deleteBasket(name);
    if (activeBasketName === name) {
      setActiveBasketName("Presentation Basket");
    }
    setSavedBasketMessage(`Deleted saved basket “${name}”.`);
  };

  const handleClearBasket = () => {
    clearBasket();
    setActiveBasketName("Presentation Basket");
  };

  const handleOfflineCache = async () => {
    if (selectedProducts.length === 0 || isCachingOffline) {
      return;
    }

    setIsCachingOffline(true);
    setOfflineError("");
    setOfflineProgress(`Saving 0/${selectedProducts.length}…`);

    try {
      const result = await cacheVisualAidsOffline(
        selectedProducts.map((product) => product.visualAidImage),
        ({ completed, total }) => {
          setOfflineProgress(`Saving ${completed}/${total}…`);
        },
      );

      if (result.failures.length > 0) {
        setOfflineError(
          `${result.completed} of ${result.total} visual aids were saved. Please retry the remaining ${result.failures.length}.`,
        );
      } else {
        setOfflineProgress(
          `${result.completed} visual aids are available offline.`,
        );
      }
    } catch (error) {
      setOfflineProgress("");
      setOfflineError(
        error instanceof Error
          ? error.message
          : "The visual aids could not be saved offline.",
      );
    } finally {
      setIsCachingOffline(false);
    }
  };

  const handleExport = async (type: "pdf" | "ppt") => {
    if (selectedProducts.length === 0 || exporting) {
      return;
    }

    setExporting(type);
    setExportError("");
    setExportProgress(`Preparing 1/${selectedProducts.length + 1}…`);

    try {
      if (type === "pdf") {
        await exportBasketAsPdf(
          selectedProducts,
          setExportProgress,
          activeBasketName,
        );
      } else {
        await exportBasketAsPpt(
          selectedProducts,
          setExportProgress,
          activeBasketName,
        );
      }
    } catch (error) {
      setExportError(
        error instanceof Error
          ? error.message
          : "Export could not be created. Please try again.",
      );
    } finally {
      setExporting(null);
      setExportProgress("");
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

        {sharedItemsParam && sharedBasketSlugs.length > 0 ? (
          <section className="mb-6 rounded-xl border border-teal/35 bg-teal/10 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-ink">
                  Load shared basket ({sharedBasketSlugs.length}{" "}
                  {sharedBasketSlugs.length === 1 ? "product" : "products"})?
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate">
                  This replaces the products currently in your presentation basket.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleLoadSharedBasket}
                  className="primary-button min-h-10 px-4"
                >
                  Load shared basket
                </button>
                <button
                  type="button"
                  onClick={handleDismissSharedBasket}
                  className="secondary-button min-h-10 px-4"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mb-6 rounded-xl border border-line bg-white p-5 shadow-soft">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="field-label">Saved baskets</p>
              <h2 className="mt-2 text-xl font-extrabold text-ink">
                Reuse detailing sets
              </h2>
              <p className="mt-1 text-sm text-slate">
                Current set: <span className="font-bold text-blue">{activeBasketName}</span>
              </p>
            </div>
            <div className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
              <label htmlFor="basket-name" className="sr-only">
                Saved basket name
              </label>
              <input
                id="basket-name"
                value={basketName}
                onChange={(event) => setBasketName(event.target.value)}
                placeholder={suggestedBasketName}
                list="basket-name-suggestions"
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate/70 focus-visible:border-blue focus-visible:ring-4 focus-visible:ring-blue/60"
              />
              <datalist id="basket-name-suggestions">
                {therapeuticAreas.map((area) => (
                  <option key={area} value={`${area} Set`} />
                ))}
                <option value="Doctor Visit Set" />
              </datalist>
              <button
                type="button"
                onClick={handleSaveBasket}
                disabled={selectedProducts.length === 0}
                className="primary-button min-h-11 shrink-0"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                Save as
              </button>
            </div>
          </div>

          {savedBasketsReady && Object.keys(savedBaskets).length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(savedBaskets)
                .sort(([first], [second]) => first.localeCompare(second))
                .map(([name, savedSlugs]) => (
                  <div
                    key={name}
                    className="inline-flex items-center overflow-hidden rounded-full border border-blue/20 bg-porcelain text-sm font-bold text-blue"
                  >
                    <button
                      type="button"
                      onClick={() => handleLoadSavedBasket(name, savedSlugs)}
                      aria-pressed={activeBasketName === name}
                      className="inline-flex min-h-10 items-center gap-2 px-3 transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue/60"
                    >
                      <FolderOpen className="h-4 w-4" aria-hidden="true" />
                      {name} · {savedSlugs.length}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSavedBasket(name)}
                      aria-label={`Delete saved basket ${name}`}
                      className="inline-flex min-h-10 w-10 items-center justify-center border-l border-blue/15 text-slate transition hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-red-600"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
            </div>
          ) : null}

          {savedBasketMessage ? (
            <p role="status" aria-live="polite" className="mt-3 text-sm font-semibold text-blue">
              {savedBasketMessage}
            </p>
          ) : null}
        </section>

        {!isReady ? (
          <div className="surface-card p-8 text-center" role="status" aria-live="polite">
            <p className="font-semibold text-slate">Loading presentation basket…</p>
          </div>
        ) : selectedProducts.length > 0 ? (
          <>
            <div className="mb-6 rounded-xl border border-line bg-white p-4 shadow-premium sm:p-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm font-semibold text-slate">
                  Export selected products to share with doctor.
                </p>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <button
                    type="button"
                    onClick={openPresentation}
                    disabled={isActionDisabled}
                    className="primary-button disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <Play className="h-4 w-4" aria-hidden="true" />
                    Start Presentation
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("pdf")}
                    disabled={isActionDisabled}
                    className="secondary-button"
                  >
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {exporting === "pdf" ? exportProgress : "Export PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExport("ppt")}
                    disabled={isActionDisabled}
                    className="secondary-button"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {exporting === "ppt" ? exportProgress : "Export PPT"}
                  </button>
                  <button
                    type="button"
                    onClick={handleOfflineCache}
                    disabled={isActionDisabled || isCachingOffline}
                    className="secondary-button"
                  >
                    <CloudDownload className="h-4 w-4" aria-hidden="true" />
                    {isCachingOffline ? offlineProgress : "Available Offline"}
                  </button>
                  <a
                    href={shareBasketLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp-button"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    Share Basket
                  </a>
                  <button
                    type="button"
                    onClick={handleClearBasket}
                    disabled={count === 0 || exporting !== null}
                    className="secondary-button text-slate"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    Clear Basket
                  </button>
                </div>
              </div>

              {exportError ? (
                <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
                  {exportError}
                </p>
              ) : null}
              {exportProgress ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-sm font-semibold text-blue"
                >
                  {exportProgress}
                </p>
              ) : null}
              {offlineProgress && !isCachingOffline ? (
                <p
                  role="status"
                  aria-live="polite"
                  className="mt-3 text-sm font-semibold text-blue"
                >
                  {offlineProgress}
                </p>
              ) : null}
              {offlineError ? (
                <p role="alert" className="mt-3 text-sm font-semibold text-red-700">
                  {offlineError}
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
          <div className="surface-card p-8 text-center">
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
          onClose={closePresentation}
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
      className={`grid gap-4 rounded-xl border bg-white p-4 shadow-soft transition-shadow sm:grid-cols-[44px_140px_minmax(0,1fr)_120px] sm:items-center ${
        isDragging
          ? "border-blue/50 shadow-premium"
          : "border-line"
      }`}
    >
      <button
        type="button"
        aria-label={`Drag ${product.brandName} to reorder`}
        className="flex h-11 w-11 touch-none items-center justify-center rounded-lg border border-line bg-paper text-blue transition hover:border-blue hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60 sm:self-center"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="relative aspect-[16/9] min-w-0 overflow-hidden rounded-lg border border-line bg-white">
        <Image
          src={product.visualAidImage}
          alt={getProductImageAlt(product)}
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
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-paper px-4 text-sm font-bold text-slate transition hover:border-blue hover:bg-white hover:text-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue/60"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Remove
      </button>
    </article>
  );
}
