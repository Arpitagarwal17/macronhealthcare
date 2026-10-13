"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import type { Product } from "@/data/products";
import styles from "./HomeProductCarousel.module.css";

type CarouselProduct = Pick<Product, "slug" | "brandName" | "dosageForm" | "productImages">;

export default function HomeProductCarousel({ products }: { products: CarouselProduct[] }) {
  const root = useRef<HTMLDivElement>(null);
  const resume = useRef<() => void>(() => {});
  const reducedMotion = useRef(true);
  const [viewportRef, carousel] = useEmblaCarousel(
    { loop: true, align: "start", duration: 35 },
    [AutoScroll({ speed: 0.8, startDelay: 1500, playOnInit: false, stopOnInteraction: true, stopOnFocusIn: true })],
  );

  useEffect(() => {
    const element = root.current;
    if (!carousel || !element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const automatic = carousel.plugins().autoScroll;
    let inView = false;
    let hovered = false;
    let dragging = false;

    // One owner for automatic motion prevents focus, visibility and dragging
    // from independently restarting the carousel while another should hold it.
    const syncMotion = () => {
      reducedMotion.current = motion.matches;
      const keyboardFocus = element.querySelector(":focus-visible");
      if (inView && !document.hidden && !motion.matches && !hovered && !dragging && !keyboardFocus) {
        automatic.play(1500);
      } else {
        automatic.stop();
      }
    };
    resume.current = syncMotion;
    const enter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") { hovered = true; syncMotion(); }
    };
    const leave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") { hovered = false; syncMotion(); }
    };
    const pointerDown = () => { dragging = true; syncMotion(); };
    const pointerUp = () => { dragging = false; syncMotion(); };
    const reinitialize = () => { dragging = false; syncMotion(); };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncMotion();
    }, { threshold: 0.1 });

    observer.observe(element);
    element.addEventListener("pointerenter", enter);
    element.addEventListener("pointerleave", leave);
    element.addEventListener("focusin", syncMotion);
    element.addEventListener("focusout", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    motion.addEventListener("change", syncMotion);
    carousel.on("pointerDown", pointerDown).on("pointerUp", pointerUp).on("reInit", reinitialize);
    syncMotion();

    return () => {
      resume.current = () => {};
      observer.disconnect();
      automatic.stop();
      element.removeEventListener("pointerenter", enter);
      element.removeEventListener("pointerleave", leave);
      element.removeEventListener("focusin", syncMotion);
      element.removeEventListener("focusout", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      motion.removeEventListener("change", syncMotion);
      carousel.off("pointerDown", pointerDown).off("pointerUp", pointerUp).off("reInit", reinitialize);
    };
  }, [carousel]);

  const navigate = (direction: "previous" | "next") => {
    if (!carousel) return;
    carousel.plugins().autoScroll.stop();
    if (direction === "previous") carousel.scrollPrev(reducedMotion.current);
    else carousel.scrollNext(reducedMotion.current);
    resume.current();
  };

  return (
    <div ref={root} className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Product highlights">
      <div className={styles.viewport} ref={viewportRef} data-ready={Boolean(carousel)} id="home-product-carousel">
        <div className={styles.track}>
          {products.map((product, index) => (
            <div className={styles.slide} key={product.slug} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${products.length}`}>
              <Link href={`/product-portfolio/${product.slug}`} className={styles.card} prefetch={false} draggable={false}>
                <div className={styles.image}>
                  {product.productImages?.[0] && <Image
                    src={product.productImages[0].src}
                    alt={`${product.productImages[0].label} product photo`}
                    fill
                    sizes="(min-width: 1200px) 390px, (min-width: 900px) 31vw, (min-width: 640px) 46vw, 84vw"
                    className="object-contain"
                    draggable={false}
                  />}
                </div>
                <div className={styles.caption}>
                  <div><p>{product.dosageForm}</p><h3>{product.brandName}</h3></div>
                  <span className={styles.cardArrow}><ArrowUpRight size={20} aria-hidden="true" /></span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.navigation}>
        <p>Discover our range</p>
        <div className={styles.arrows}>
          <button type="button" onClick={() => navigate("previous")} aria-label="Previous products" aria-controls="home-product-carousel" disabled={!carousel}><ArrowLeft size={20} aria-hidden="true" /></button>
          <button type="button" onClick={() => navigate("next")} aria-label="Next products" aria-controls="home-product-carousel" disabled={!carousel}><ArrowRight size={20} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
