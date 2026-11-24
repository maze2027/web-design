import { getTranslations } from "next-intl/server";
import type { AppPathname, Locale } from "@/i18n/routing";
import { absUrl } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { NavLink } from "./NavLink";

export async function Breadcrumbs({ locale, current, href }: { locale: Locale; current: string; href: AppPathname }) {
  const t = await getTranslations({ locale, namespace: "common" });
  const crumbs = [
    { name: t("home"), url: absUrl(locale, "/") },
    { name: current, url: absUrl(locale, href) },
  ];
  return (
    <>
      <nav aria-label={t("breadcrumb")} className="text-sm text-slate">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <NavLink href="/" className="link-underline hover:text-paper">
              {t("home")}
            </NavLink>
          </li>
          <li aria-hidden="true" className="text-asphalt-4">/</li>
          <li aria-current="page" className="text-paper/90">
            {current}
          </li>
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(crumbs)} />
    </>
  );
}
