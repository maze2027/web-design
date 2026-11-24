"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { loadGsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/** Slow parallax + subtle scale on the hero photo. GSAP loads after first paint. */
export function HeroParallax({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    const start = () =>
      loadGsap().then(({ gsap }) => {
        if (cancelled) return;
        ctx = gsap.context(() => {
          gsap.fromTo(
            el,
            { yPercent: 0, scale: 1.08 },
            { yPercent: 9, scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top top", end: "bottom top", scrub: 0.6 } },
          );
        });
      });
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
    else setTimeout(start, 600);
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return (
    <div ref={ref} className={`absolute inset-0 scale-[1.08] will-change-transform motion-reduce:scale-100 ${className}`}>
      {children}
    </div>
  );
}
