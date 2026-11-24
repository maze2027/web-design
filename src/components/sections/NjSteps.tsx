import { getTranslations } from "next-intl/server";
import { business } from "@/config/site";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function NjSteps({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const tracks = [
    { key: "under21", items: t.raw("home.njSteps.under21.items") as string[], dark: true },
    { key: "over21", items: t.raw("home.njSteps.over21.items") as string[], dark: false },
  ];
  return (
    <section className="on-light bg-paper py-24 sm:py-32" aria-labelledby="njsteps-title">
      <div className="container-x">
        <SectionHeading id="njsteps-title" eyebrow={t("home.njSteps.eyebrow")} title={t("home.njSteps.title")} intro={t("home.njSteps.intro")} />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {tracks.map((tr, ti) => (
            <article
              key={tr.key}
              data-reveal
              style={{ ["--d" as string]: ti }}
              className={`card relative overflow-hidden p-8 sm:p-10 ${tr.dark ? "bg-asphalt text-paper" : "border border-line bg-white"}`}
            >
              <h3 className="text-h3">{t(`home.njSteps.${tr.key}.title`)}</h3>
              <div className="lane-divider mt-5 w-24" style={{ ["--lane" as string]: tr.dark ? "#FFC72C" : "#0E1116" }} aria-hidden="true" />
              <ol className="mt-7 space-y-4">
                {tr.items.map((it, i) => (
                  <li key={i} className="flex gap-4">
                    <span className={`grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold ${tr.dark ? "bg-yellow text-asphalt" : "bg-asphalt text-yellow"}`}>{i + 1}</span>
                    <span className={`pt-1 leading-relaxed ${tr.dark ? "text-paper/90" : "text-asphalt"}`}>{it}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-6 rounded-[24px] border border-dashed border-asphalt/25 p-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <p className="text-sm text-ink-muted">
            <strong className="font-semibold text-asphalt">{t("common.lastVerified")}.</strong> {t("common.mvcCheck")}{" "}
            <a href={business.mvcUrl} target="_blank" rel="noopener noreferrer" className="link-underline font-semibold text-asphalt underline decoration-asphalt/30 underline-offset-4">
              {t("common.mvcLink")}
              <span className="sr-only"> {t("common.external")}</span>
            </a>
          </p>
          <NavLink href="/nj-license-guide" className="btn btn-dark shrink-0">
            {t("home.njSteps.cta")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </NavLink>
        </div>
      </div>
    </section>
  );
}
