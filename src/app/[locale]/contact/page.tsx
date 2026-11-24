import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business, mapLinks, SERVICE_IDS, whatsappHref } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { BookingForm } from "@/components/sections/BookingForm";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { MapFacade } from "@/components/ui/MapFacade";
import { OpenStatus } from "@/components/ui/OpenStatus";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "contact", "/contact");
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const services = SERVICE_IDS.map((s) => ({ id: s, name: t(`services.items.${s}.name`) }));
  const next = t.raw("contact.next") as string[];

  return (
    <>
      <PageHero locale={locale} href="/contact" crumb={t("nav.contact")} eyebrow={t("contact.eyebrow")} title={t("contact.title")} intro={t("contact.intro")} />
      <section className="on-light bg-paper py-16 sm:py-24">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div id="book" className="lg:col-span-7">
            <BookingForm services={services} idPrefix="contact" />
          </div>

          <div className="space-y-6 lg:col-span-5">
            <div className="card bg-asphalt p-7 text-paper sm:p-8">
              <h2 className="text-h3">{t("contact.callTitle")}</h2>
              <div className="mt-3">
                <OpenStatus openLabel={t("common.openNow")} closedLabel={t("common.closedNow")} />
              </div>
              <a href={business.phoneHref} className="mt-5 block font-display text-[clamp(1.8rem,1.4rem+1.5vw,2.4rem)] font-extrabold tracking-tight text-yellow">
                {business.phoneDisplay}
              </a>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a href={business.phoneHref} className="btn btn-primary btn-sm">
                  <Icon name="phone" className="size-4" /> {t("common.callNow")}
                </a>
                <a href={whatsappHref(t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-sm">
                  <WhatsAppIcon className="size-4" /> {t("common.whatsappLong")}
                  <span className="sr-only">{t("common.external")}</span>
                </a>
              </div>
              {business.whatsapp.includes("X") && (
                <p className="mt-3">
                  <ConfirmBadge label="WhatsApp number" />
                </p>
              )}
              <p className="mt-5 text-sm text-slate">{t("common.otherLanguages")}</p>
              {!business.email && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate">
                  Email: <ConfirmBadge label="Email" />
                </p>
              )}
            </div>

            <div className="card border border-line bg-white p-7 sm:p-8">
              <h2 className="text-h3">{t("contact.visitTitle")}</h2>
              <address className="mt-3 not-italic leading-relaxed">
                <strong>{business.name}</strong>
                <br />
                {business.address.street}
                <br />
                {business.address.city}, {business.address.region} {business.address.postalCode}
              </address>
              <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm">
                <dt className="text-ink-muted">{t("hours.weekdaysLong")}</dt>
                <dd className="font-semibold">{t("hours.weekdaysTime")}</dd>
                <dt className="text-ink-muted">{t("hours.saturdayLong")}</dt>
                <dd className="font-semibold">{t("hours.saturdayTime")}</dd>
                <dt className="text-ink-muted">{t("hours.sundayLong")}</dt>
                <dd className="font-semibold">{t("hours.closed")}</dd>
              </dl>
              <a href={mapLinks.directions} target="_blank" rel="noopener noreferrer" className="btn btn-dark btn-sm mt-6">
                <Icon name="pin" className="size-4" /> {t("common.getDirections")}
                <span className="sr-only">{t("common.external")}</span>
              </a>
            </div>

            <div className="card border border-line bg-white p-7 sm:p-8">
              <h2 className="text-h3">{t("contact.nextTitle")}</h2>
              <ol className="mt-5 space-y-4">
                {next.map((n, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-yellow text-sm font-bold">{i + 1}</span>
                    <span className="pt-1">{n}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="container-x mt-16">
          <MapFacade
            loadLabel={t("areas.loadMap")}
            note={t("areas.mapNote")}
            frameTitle={t("areas.mapFrameTitle")}
            directionsLabel={t("common.getDirections")}
            address={business.address.oneLine}
            externalLabel={t("common.external")}
          />
        </div>
      </section>
    </>
  );
}
