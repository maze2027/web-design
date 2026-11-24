import { defineRouting } from "next-intl/routing";

/**
 * To add a language later (e.g. Portuguese or Arabic):
 *  1. add it to `locales` (and to RTL_LOCALES if right-to-left),
 *  2. add messages/<locale>.json,
 *  3. add a localized slug for it under every entry in `pathnames`,
 *  4. add its hreflang code to HREFLANG.
 * Nothing else needs to change: hreflang, sitemap, switcher and `dir` read from here.
 */
export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  localePrefix: "always",
  alternateLinks: false, // hreflang is emitted in <head> + sitemap instead
  localeCookie: { name: "NEXT_LOCALE", maxAge: 60 * 60 * 24 * 365 },
  pathnames: {
    "/": "/",
    "/services": { en: "/services", es: "/servicios" },
    "/nj-license-guide": { en: "/nj-license-guide", es: "/guia-licencia-nj" },
    "/about": { en: "/about", es: "/nosotros" },
    "/areas": { en: "/areas-we-serve", es: "/zonas" },
    "/faq": { en: "/faq", es: "/preguntas-frecuentes" },
    "/contact": { en: "/contact", es: "/contacto" },
    "/privacy": { en: "/privacy", es: "/privacidad" },
    "/terms": { en: "/terms", es: "/terminos" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

export const RTL_LOCALES: readonly string[] = ["ar"];
export const HREFLANG: Record<Locale, string> = { en: "en-US", es: "es-US" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", es: "es_US" };
export const LOCALE_LABEL: Record<Locale, { short: string; long: string }> = {
  en: { short: "EN", long: "English" },
  es: { short: "ES", long: "Español" },
};

export const dirFor = (locale: string) => (RTL_LOCALES.includes(locale) ? "rtl" : "ltr");
