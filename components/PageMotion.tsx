"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./PageMotion.module.css";

export default function PageMotion({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const elements = Array.from(page.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (preference.matches || !("IntersectionObserver" in window)) return;

    const animations = new Set<Animation>();
    const reveal = (element: HTMLElement) => {
      const wasPending = element.dataset.motion === "pending";
      delete element.dataset.motion;
      observer.unobserve(element);
      if (wasPending && !preference.matches && typeof element.animate === "function") {
        const stagger = Number(element.dataset.reveal);
        const animation = element.animate(
          [{ opacity: 0, translate: "0 26px" }, { opacity: 1, translate: "0 0" }],
          { duration: 750, delay: Number.isFinite(stagger) ? stagger * 90 : 0, easing: "cubic-bezier(.22, 1, .36, 1)", fill: "backwards" },
        );
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
        animation.oncancel = () => animations.delete(animation);
      }
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });

    // Progressive enhancement: initial content and the no-JS page stay visible.
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight * 0.94) {
        element.dataset.motion = "pending";
        observer.observe(element);
      }
    });
    const revealAll = () => {
      if (preference.matches) {
        animations.forEach((animation) => animation.cancel());
        elements.forEach(reveal);
      }
    };
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      let element = event.target.closest<HTMLElement>("[data-reveal]");
      while (element && page.contains(element)) {
        reveal(element);
        element = element.parentElement?.closest<HTMLElement>("[data-reveal]") ?? null;
      }
    };
    preference.addEventListener("change", revealAll);
    page.addEventListener("focusin", revealFocused);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      preference.removeEventListener("change", revealAll);
      page.removeEventListener("focusin", revealFocused);
      elements.forEach((element) => delete element.dataset.motion);
    };
  }, []);

  return <div ref={root} className={`${className} ${styles.motion}`}>{children}</div>;
}
