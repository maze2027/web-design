"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getLenis, setLenis } from "@/lib/lenis";
import { prefersReducedMotion } from "@/lib/motion";

/** Lenis smooth scrolling, started after first paint and skipped for reduced motion. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let destroyed = false;
    let cleanup = () => {};
    const start = () =>
      import("lenis").then(({ default: Lenis }) => {
        if (destroyed) return;
        const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -88 } });
        setLenis(lenis);
        cleanup = () => {
          lenis.destroy();
          setLenis(null);
        };
      });
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(start);
    else setTimeout(start, 200);
    return () => {
      destroyed = true;
      cleanup();
    };
  }, []);

  // Keep Lenis in sync with Next's scroll reset on navigation.
  useEffect(() => {
    const lenis = getLenis();
    if (lenis && !window.location.hash) lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
