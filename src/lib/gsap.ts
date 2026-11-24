import { onLenis } from "./lenis";

type GsapBundle = {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
};

let loading: Promise<GsapBundle> | null = null;

/** GSAP + ScrollTrigger are code-split and only fetched when an animated section gets close. */
export function loadGsap(): Promise<GsapBundle> {
  if (!loading) {
    loading = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, st]) => {
      const gsap = g.gsap;
      const ScrollTrigger = st.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      onLenis((lenis) => lenis.on("scroll", ScrollTrigger.update));
      return { gsap, ScrollTrigger };
    });
  }
  return loading;
}
