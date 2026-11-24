import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business, mapLinks } from "@/config/site";
import { TOWNS } from "@/config/areas";
import { IMG } from "@/config/images";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { Icon } from "@/components/ui/Icon";
import { MapFacade } from "@/components/ui/MapFacade";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "areas", "/areas");
}

export default async function AreasPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return (
    <>
      <PageHero
        locale={locale}
        href="/areas"
        crumb={t("nav.areas")}
        eyebrow={t("areas.eyebrow")}
        title={t("areas.title")}
        intro={t("areas.intro")}
        image={IMG.city}
        imageAlt={t("guide.imageAlts.city")}
      />
      <section className="on-light bg-paper py-20 sm:py-28" aria-labelledby="towns-h">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="flex flex-wrap items-center gap-3">
              <h2 id="towns-h" className="text-h2">
                {t("areas.listTitle")}
              </h2>
              <ConfirmBadge label="Service area" />
            </div>
            <p className="mt-3 text-sm text-ink-muted">{t("areas.confirmNote")}</p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {TOWNS.map((town, i) => (
                <li key={town} data-reveal style={{ ["--d" as string]: i % 4 }} className={`card flex min-h-16 items-center gap-3 px-5 font-semibold ${i === 0 ? "bg-asphalt text-paper" : "border border-line bg-white"}`}>
                  <Icon name="pin" className={`size-5 ${i === 0 ? "text-yellow" : "text-asphalt/60"}`} />
                  {town}, NJ
                </li>
              ))}
              <li className="card flex min-h-16 items-center gap-3 border border-dashed border-asphalt/30 px-5 font-semibold sm:col-span-2">
                <Icon name="route" className="size-5 text-asphalt/60" /> {t("areas.counties")}
              </li>
            </ul>
            <p className="mt-6 text-ink-muted">
              {t("areas.notListed")}{" "}
              <a href={business.phoneHref} className="font-semibold text-asphalt underline underline-offset-4">
                {business.phoneDisplay}
              </a>
            </p>
          </div>
          <div className="lg:col-span-6">
            <h2 className="text-h3">{t("areas.mapTitle")}</h2>
            <address className="mt-2 not-italic text-ink-muted">{business.address.oneLine}</address>
            <div className="mt-6">
              <MapFacade
                loadLabel={t("areas.loadMap")}
                note={t("areas.mapNote")}
                frameTitle={t("areas.mapFrameTitle")}
                directionsLabel={t("common.getDirections")}
                address={business.address.oneLine}
                externalLabel={t("common.external")}
              />
            </div>
            <a href={mapLinks.directions} target="_blank" rel="noopener noreferrer" className="btn btn-dark mt-6">
              <Icon name="pin" className="size-5" /> {t("common.getDirections")}
              <span className="sr-only">{t("common.external")}</span>
            </a>
          </div>
        </div>
      </section>
      <FinalCta locale={locale} id="book-areas" />
    </>
  );
}
