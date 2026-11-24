import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SERVICE_IDS } from "@/config/site";
import { IMG } from "@/config/images";
import { absUrl, pageMetadata } from "@/lib/seo";
import { servicesSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { SERVICE_IMAGES } from "@/components/sections/ServicesPreview";
import { FinalCta } from "@/components/sections/FinalCta";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SmartImage } from "@/components/ui/SmartImage";
import { Magnetic } from "@/components/ui/Magnetic";
import { business } from "@/config/site";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "services", "/services");
}

type Item = { anchor: string; name: string; short: string; who: string[]; learn: string[]; imageAlt: string };

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const items = t.raw("services.items") as Record<string, Item>;

  return (
    <>
      <PageHero
        locale={locale}
        href="/services"
        crumb={t("nav.services")}
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        intro={t("services.intro")}
        image={IMG.inCar}
        imageAlt={t("services.items.lessons.imageAlt")}
      />

      {/* Sticky in-page jump navigation */}
      <nav aria-label={t("services.jumpTo")} className="sticky top-[70px] z-30 border-b border-line bg-paper/90 backdrop-blur-xl">
        <ul className="no-scrollbar container-x flex gap-2 overflow-x-auto py-3">
          {SERVICE_IDS.map((id) => (
            <li key={id} className="shrink-0">
              <a href={`#${items[id].anchor}`} className="on-light inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold hover:border-asphalt">
                {items[id].name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="on-light bg-paper">
        {SERVICE_IDS.map((id, i) => {
          const it = items[id];
          const flip = i % 2 === 1;
          return (
            <section key={id} id={it.anchor} aria-labelledby={`${it.anchor}-h`} className={`py-20 sm:py-28 ${i % 2 ? "bg-paper-2" : ""}`}>
              <div className="container-x grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                <div className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}>
                  <div className="card clip-reveal relative aspect-[4/3] overflow-hidden bg-asphalt-2 lg:aspect-[4/5]">
                    <SmartImage src={IMG[SERVICE_IMAGES[id]]} alt={it.imageAlt} fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                    <span className="absolute start-5 top-5 z-[3] grid size-12 place-items-center rounded-full bg-yellow font-display font-extrabold text-asphalt">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                <div className={`lg:col-span-7 ${flip ? "lg:order-1 lg:col-start-1 lg:row-start-1" : ""}`} data-reveal>
                  <h2 id={`${it.anchor}-h`} className="text-h2">
                    {it.name}
                  </h2>
                  <p className="mt-4 text-lead text-ink-muted">{it.short}</p>
                  <div className="mt-8 grid gap-8 sm:grid-cols-2">
                    <div>
                      <h3 className="font-display text-lg font-bold">{t("services.whoFor")}</h3>
                      <ul className="mt-3 space-y-2.5">
                        {it.who.map((w, k) => (
                          <li key={k} className="flex gap-3 leading-relaxed">
                            <Icon name="check" className="mt-1 size-4 shrink-0 text-green-ink" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold">{t("services.whatLearn")}</h3>
                      <ul className="mt-3 space-y-2.5">
                        {it.learn.map((w, k) => (
                          <li key={k} className="flex gap-3 leading-relaxed">
                            <span aria-hidden="true" className="mt-2.5 h-[3px] w-3 shrink-0 rounded bg-asphalt" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-dashed border-asphalt/25 px-5 py-4">
                    <span className="font-semibold">{t("services.pricing")}:</span>
                    <span className="text-ink-muted">{t("services.pricingValue")}</span>
                    <ConfirmBadge label="Pricing" />
                  </div>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Magnetic>
                      <NavLink href={{ pathname: "/contact", query: { service: id }, hash: "book" }} className="btn btn-dark w-full sm:w-auto">
                        <Icon name="calendar" className="size-5" /> {t("services.bookThis")}
                      </NavLink>
                    </Magnetic>
                    <a href={business.phoneHref} className="btn btn-ghost-light">
                      <Icon name="phone" className="size-5" /> {t("services.askAbout")}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <FinalCta locale={locale} id="book-services" />
      <JsonLd data={servicesSchema(locale, items, absUrl(locale, "/services"))} />
    </>
  );
}
