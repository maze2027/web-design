import { getTranslations } from "next-intl/server";
import { TOWNS } from "@/config/areas";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function AreasPreview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <section className="on-light bg-paper py-24 sm:py-32" aria-labelledby="areas-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="areas-title" eyebrow={t("home.areasPreview.eyebrow")} title={t("home.areasPreview.title")} intro={t("home.areasPreview.intro")} />
          <NavLink href="/areas" className="btn btn-dark mt-8">
            {t("home.areasPreview.cta")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </NavLink>
        </div>
        <ul className="flex flex-wrap content-start gap-3 lg:col-span-7 lg:pt-12">
          {TOWNS.map((town, i) => (
            <li key={town} data-reveal style={{ ["--d" as string]: i % 5 }}>
              <span className={`inline-flex min-h-12 items-center gap-2 rounded-full px-5 font-semibold ${i === 0 ? "bg-yellow text-asphalt" : "border border-line bg-white text-asphalt"}`}>
                <Icon name="pin" className="size-4" /> {town}
              </span>
            </li>
          ))}
          <li data-reveal>
            <span className="inline-flex min-h-12 items-center rounded-full border border-dashed border-asphalt/30 px-5 font-semibold text-ink-muted">{t("areas.counties")}</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
