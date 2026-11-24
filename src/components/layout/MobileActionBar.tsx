"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { business, whatsappHref } from "@/config/site";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";

/** Sticky Call · WhatsApp · Book bar on phones. Hides on scroll-down, returns on scroll-up. */
export function MobileActionBar() {
  const t = useTranslations();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        const delta = y - last;
        if (Math.abs(delta) > 6) {
          setHidden(delta > 0 && y > 240);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const item = "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 rounded-2xl text-[0.78rem] font-semibold";
  return (
    <nav
      aria-label={t("common.quickActions")}
      className={`fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(10px,env(safe-area-inset-bottom))] pt-2 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
        hidden ? "translate-y-[115%]" : ""
      }`}
    >
      <div className="flex gap-2 rounded-[22px] border border-white/10 bg-asphalt/90 p-1.5 text-paper shadow-[0_18px_40px_-12px_rgba(0,0,0,.55)] backdrop-blur-xl">
        <a href={business.phoneHref} className={`${item} active:scale-[0.97]`}>
          <Icon name="phone" className="size-5 text-yellow" />
          {t("common.call")}
        </a>
        <a href={whatsappHref(t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" className={`${item} active:scale-[0.97]`}>
          <WhatsAppIcon className="size-5 text-green" />
          {t("common.whatsapp")}
          <span className="sr-only">{t("common.external")}</span>
        </a>
        <NavLink href={{ pathname: "/contact", hash: "book" }} className={`${item} bg-yellow text-asphalt active:scale-[0.97]`}>
          <Icon name="calendar" className="size-5" />
          {t("common.bookShort")}
        </NavLink>
      </div>
    </nav>
  );
}
