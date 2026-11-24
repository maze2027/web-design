import type Lenis from "lenis";

let instance: Lenis | null = null;
const listeners = new Set<(l: Lenis) => void>();

export const getLenis = () => instance;
export function setLenis(l: Lenis | null) {
  instance = l;
  if (l) listeners.forEach((fn) => fn(l));
}
/** Calls `fn` now if Lenis is running, or as soon as it starts. */
export function onLenis(fn: (l: Lenis) => void) {
  if (instance) fn(instance);
  listeners.add(fn);
  return () => listeners.delete(fn);
}
