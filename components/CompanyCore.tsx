"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Compass, Eye, HeartHandshake, Pause, Play, ShieldCheck } from "lucide-react";
import styles from "./CompanyCore.module.css";

const STEP_DURATION = 6500;
const principles = [
  { label: "Our mission", icon: Compass, title: "Purpose in every step.", text: "To contribute to better healthcare through responsible work, meaningful relationships and dependable service.", href: "/about#mission" },
  { label: "Our vision", icon: Eye, title: "A healthier tomorrow.", text: "A future where healthcare is shaped by understanding, trust and respect for every person receiving care.", href: "/about#vision" },
  { label: "Our values", icon: ShieldCheck, title: "Integrity. Empathy. Respect.", text: "The principles that guide our decisions and our relationships with doctors, patients and the people we work with.", href: "/about#values" },
  { label: "Our promise", icon: HeartHandshake, title: "To keep moving forward.", text: "To listen, to keep improving, and to approach our work with the care and responsibility that healthcare deserves.", href: "/about#quality" },
];

export default function CompanyCore() {
  const root = useRef<HTMLElement>(null);
  const traveller = useRef<SVGGElement>(null);
  const elapsed = useRef(0);
  const currentIndex = useRef(0);
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [focusPaused, setFocusPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);

  // The marker moves clockwise on one continuous clock. Reaching each node
  // updates its highlight and copy together, including the final wrap to mission.
  const drawCycle = useCallback((time: number) => {
    const step = time / STEP_DURATION;
    const index = Math.floor(step) % principles.length;
    const angle = (step % principles.length) * 90;
    traveller.current?.setAttribute("transform", `rotate(${angle} 300 300)`);
    if (currentIndex.current !== index) {
      currentIndex.current = index;
      setActive(index);
    }
  }, []);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(preference.matches);
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    preference.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 })
      : null;
    if (observer && root.current) observer.observe(root.current);
    else setVisible(true);
    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  const animating = playing && !focusPaused && visible && documentVisible && !reducedMotion;
  useEffect(() => {
    if (!animating) return;
    let frame: number;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) elapsed.current += now - previous;
      previous = now;
      drawCycle(elapsed.current);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [animating, drawCycle]);

  const selectPrinciple = (index: number) => {
    elapsed.current = index * STEP_DURATION;
    drawCycle(elapsed.current);
  };
  const selected = principles[active];
  const Icon = selected.icon;

  return (
    <section ref={root} id="our-company" className={styles.section} aria-labelledby="company-heading">
      <div className="page-shell">
        <div className={styles.headingRow} data-reveal>
          <div><p className="eyebrow">At our core</p><h2 id="company-heading">Our values. A shared purpose.</h2></div>
          <p>What we stand for shapes how we work, who we serve and the future we want to help build.</p>
        </div>
        <div className={styles.experience} data-playing={animating} data-reduced-motion={reducedMotion}>
          <div className={styles.visual}>
            <div className={styles.wheel}>
              <svg className={styles.orbit} viewBox="0 0 600 600" fill="none" aria-hidden="true">
                <circle className={styles.track} cx="300" cy="300" r="216" />
                <circle className={styles.innerTrack} cx="300" cy="300" r="153" />
                <path className={styles.spokes} d="M300 149V188M451 300H412M300 451V412M149 300H188" />
                <g ref={traveller} transform="rotate(0 300 300)">
                  <circle className={styles.trail} cx="300" cy="300" r="216" strokeDasharray="78 1280" transform="rotate(-110.69 300 300)" />
                  <circle className={styles.beaconHalo} cx="300" cy="84" r="16" />
                  <circle className={styles.beacon} cx="300" cy="84" r="6" />
                </g>
              </svg>
              <div className={styles.centre}>
                <Image src="/logo.png" alt="Macron Health Care" fill sizes="(min-width: 1024px) 170px, (min-width: 640px) 145px, 110px" className={styles.logo} />
              </div>
              <div
                className={styles.choices}
                role="group"
                aria-label="Explore our core principles"
                onFocusCapture={(event) => { if (event.target.matches(":focus-visible")) setFocusPaused(true); }}
                onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }}
              >
                {principles.map((principle, index) => {
                  const ChoiceIcon = principle.icon;
                  return <button key={principle.label} className={`${styles.choice} ${styles[`position${index}`]}`} type="button" aria-label={principle.label} aria-pressed={active === index} aria-controls="core-detail" onClick={(event) => { if (event.detail > 0) setFocusPaused(false); selectPrinciple(index); }}>
                    <ChoiceIcon size={23} strokeWidth={1.7} aria-hidden="true" />
                    <span>{principle.label.replace("Our ", "")}</span>
                  </button>;
                })}
              </div>
            </div>
          </div>
          <div className={styles.detailColumn}>
            <div
              className={styles.detail}
              id="core-detail"
              role="region"
              aria-label={selected.label}
              onFocusCapture={() => setFocusPaused(true)}
              onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusPaused(false); }}
            >
              <div className={styles.detailContent} key={active}>
                <span className={styles.detailIcon}><Icon size={30} strokeWidth={1.6} aria-hidden="true" /></span>
                <p className={styles.detailLabel}>{selected.label}</p>
                <h3>{selected.title}</h3>
                <p className={styles.detailCopy}>{selected.text}</p>
                <Link href={selected.href} className={styles.detailLink}>Discover more <ArrowUpRight size={18} aria-hidden="true" /></Link>
              </div>
            </div>
            {!reducedMotion && <button type="button" className={styles.motionButton} onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause core animation" : "Play core animation"}>{playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}<span>{playing ? "Pause animation" : "Play animation"}</span></button>}
          </div>
        </div>
      </div>
    </section>
  );
}
