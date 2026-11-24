"use client";

import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

type Navigate = (go: () => void) => void;
const Ctx = createContext<Navigate>((go) => go());

/**
 * Wraps client navigations in the View Transitions API. The transition's
 * update callback resolves once the new route has committed (pathname changed).
 * Browsers without the API fall back to the CSS `.page-fade` in the template.
 */
export function ViewTransitionsProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const resolver = useRef<(() => void) | null>(null);

  useEffect(() => {
    resolver.current?.();
    resolver.current = null;
  }, [pathname]);

  const navigate = useCallback<Navigate>((go) => {
    const doc = document as Document & { startViewTransition?: (cb: () => Promise<void>) => unknown };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!doc.startViewTransition || reduced) return go();
    doc.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          resolver.current = resolve;
          go();
          setTimeout(resolve, 1200); // never hold the page hostage
        }),
    );
  }, []);

  return <Ctx.Provider value={navigate}>{children}</Ctx.Provider>;
}

export const useViewTransition = () => useContext(Ctx);
