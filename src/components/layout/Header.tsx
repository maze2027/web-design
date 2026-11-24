"use client";

import { AnimatePresence, m } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { business } from "@/config/site";
import { NavLink } from "@/components/ui/NavLink";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { LanguageToggle } from "./LanguageToggle";
import { getLenis } from "@/lib/lenis";

export const NAV: { href: AppPathname; key: string }[] = [
  { href: "/services", key: "services" },
  { href: "/nj-license-guide", key: "guide" },
  { href: "/about", key: "about" },
  { href: "/areas", key: "areas" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
];

export function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const lenis = getLenis();
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 text-paper">
      <div
        className={`transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled ? "-translate-y-1.5" : ""}`}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 border-b border-white/10 bg-asphalt/75 backdrop-blur-xl backdrop-saturate-150 transition-opacity duration-500 ${
            scrolled || open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div className="container-x relative flex h-[76px] items-center justify-between gap-4 pt-1.5">
          <NavLink
            href="/"
            className={`origin-left rounded-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rtl:origin-right ${scrolled ? "scale-[0.92]" : ""}`}
            aria-label={`${business.name}, ${t("nav.home")}`}
          >
            <Logo />
          </NavLink>

          <nav aria-label={t("common.primaryNav")} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <li key={n.href}>
                    <NavLink
                      href={n.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative inline-flex h-11 items-center rounded-full px-3.5 text-[0.95rem] font-medium transition-colors ${
                        active ? "text-yellow" : "text-paper/85 hover:text-paper"
                      }`}
                    >
                      {t(`nav.${n.key}`)}
                      {active && <span aria-hidden="true" className="absolute inset-x-3.5 bottom-1.5 h-[3px] rounded bg-[repeating-linear-gradient(90deg,#FFC72C_0_6px,transparent_6px_10px)]" />}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageToggle />
            <div className="hidden md:block">
              <Magnetic>
                <a href={business.phoneHref} className="btn btn-primary btn-sm">
                  <Icon name="phone" className="size-4" />
                  <span className="hidden lg:inline">{business.phoneDisplay}</span>
                  <span className="lg:hidden">{t("common.call")}</span>
                </a>
              </Magnetic>
            </div>
            <button
              ref={menuBtn}
              type="button"
              className="grid size-11 place-items-center rounded-full bg-asphalt-3/80 text-paper xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">{open ? t("common.closeMenu") : t("common.openMenu")}</span>
              <Icon name={open ? "close" : "menu"} className="size-5" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 bottom-0 top-[70px] z-40 overflow-y-auto bg-asphalt xl:hidden"
          >
            <nav aria-label={t("common.primaryNav")} className="container-x flex min-h-full flex-col pb-28 pt-6">
              <ul className="flex flex-col">
                {[{ href: "/" as AppPathname, key: "home" }, ...NAV].map((n, i) => (
                  <m.li
                    key={n.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-asphalt-3"
                  >
                    <NavLink
                      href={n.href}
                      aria-current={pathname === n.href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`flex min-h-16 items-center justify-between font-display text-[1.75rem] font-extrabold tracking-tight ${pathname === n.href ? "text-yellow" : "text-paper"}`}
                    >
                      {t(`nav.${n.key}`)}
                      <Icon name="arrow" className="size-5 opacity-50 rtl:-scale-x-100" />
                    </NavLink>
                  </m.li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-4">
                <a href={business.phoneHref} className="btn btn-primary">
                  <Icon name="phone" className="size-5" /> {t("common.callNumber", { phone: business.phoneDisplay })}
                </a>
                <p className="text-sm text-slate">{t("common.otherLanguages")}</p>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
