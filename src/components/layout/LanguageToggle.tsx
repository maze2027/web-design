"use client";

import { m } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState, type MouseEvent } from "react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_LABEL, routing, type Locale } from "@/i18n/routing";
import { useViewTransition } from "@/components/providers/ViewTransitions";

const ANNOUNCE_KEY = "jk-lang-announce";

/**
 * EN | ES pill switch. The pill slides first, then the page crossfades to the
 * other locale via the View Transitions API. The choice persists via the
 * NEXT_LOCALE cookie (set by next-intl) and is announced in an aria-live region.
 */
export function LanguageToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("language");
  const pathname = usePathname();
  const router = useRouter();
  const navigate = useViewTransition();
  const [visual, setVisual] = useState<Locale>(locale);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(ANNOUNCE_KEY)) {
        sessionStorage.removeItem(ANNOUNCE_KEY);
        const live = document.getElementById("lang-announcer");
        if (live) setTimeout(() => (live.textContent = t("announce")), 250);
      }
    } catch {}
  }, [t]);

  const go = (next: Locale) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (next === locale) return;
    setVisual(next);
    try {
      sessionStorage.setItem(ANNOUNCE_KEY, "1");
      localStorage.setItem("jk-locale", next);
    } catch {}
    // Anchors are localized, so the hash is intentionally dropped.
    // Let the pill finish sliding before the crossfade starts.
    setTimeout(() => navigate(() => router.replace(pathname, { locale: next, scroll: false })), 180);
  };

  const idx = routing.locales.indexOf(visual);
  const dirSign = typeof document !== "undefined" && document.documentElement.dir === "rtl" ? -1 : 1;
  const dark = tone === "dark";

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={`relative grid h-11 grid-cols-2 items-center rounded-full p-1 text-sm font-bold ${dark ? "bg-asphalt-3/80 text-paper" : "bg-paper-2 text-asphalt"}`}
    >
      <m.span
        aria-hidden="true"
        className="absolute inset-y-1 start-1 w-[calc(50%-4px)] rounded-full bg-yellow"
        initial={false}
        animate={{ x: `${idx * 100 * dirSign}%` }}
        transition={{ type: "spring", stiffness: 480, damping: 34 }}
      />
      {routing.locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={pathname}
            locale={l}
            hrefLang={l}
            lang={l}
            onClick={go(l)}
            aria-current={active ? "true" : undefined}
            aria-label={active ? LOCALE_LABEL[l].long : l === "es" ? "Español" : "English"}
            className={`relative z-10 grid h-9 min-w-11 place-items-center rounded-full px-3 transition-colors duration-300 ${
              visual === l ? "text-asphalt" : dark ? "text-paper/80 hover:text-paper" : "text-ink-muted hover:text-asphalt"
            }`}
          >
            {LOCALE_LABEL[l].short}
          </Link>
        );
      })}
    </div>
  );
}
