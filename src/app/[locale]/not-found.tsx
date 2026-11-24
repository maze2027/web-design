import { getLocale, getTranslations } from "next-intl/server";
import { NavLink } from "@/components/ui/NavLink";
import { Icon } from "@/components/ui/Icon";

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale });
  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden bg-asphalt pt-28 pb-20 text-paper">
      <title>{t("meta.notFound.title")}</title>
      <meta name="robots" content="noindex" />
      <div className="speed-lines" aria-hidden="true">
        <span style={{ top: "30%", animationDelay: "0s" }} />
        <span style={{ top: "62%", animationDelay: "1.6s" }} />
      </div>
      <div className="container-x relative">
        <p className="font-display text-[clamp(6rem,4rem+10vw,12rem)] font-extrabold leading-none text-yellow">{t("notFound.code")}</p>
        <h1 className="mt-2 text-h1">{t("notFound.title")}</h1>
        <p className="mt-4 max-w-xl text-lead text-slate">{t("notFound.body")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <NavLink href="/" className="btn btn-primary">
            {t("notFound.home")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </NavLink>
          <NavLink href="/contact" className="btn btn-ghost-dark">
            {t("notFound.contact")}
          </NavLink>
        </div>
        <div className="lane-divider mt-16 max-w-md opacity-60" aria-hidden="true" />
      </div>
    </section>
  );
}
