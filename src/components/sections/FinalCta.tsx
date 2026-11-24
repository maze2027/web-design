import { getTranslations } from "next-intl/server";
import { IMG } from "@/config/images";
import { SERVICE_IDS } from "@/config/site";
import { CtaRow } from "@/components/ui/CtaRow";
import { SmartImage } from "@/components/ui/SmartImage";
import { BookingForm } from "./BookingForm";

export async function FinalCta({ locale, id = "book-home" }: { locale: string; id?: string }) {
  const t = await getTranslations({ locale });
  const services = SERVICE_IDS.map((s) => ({ id: s, name: t(`services.items.${s}.name`) }));
  return (
    <section id={id} className="relative isolate overflow-hidden bg-asphalt py-24 text-paper sm:py-32" aria-labelledby={`${id}-title`}>
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <SmartImage src={IMG.road} alt="" fill sizes="100vw" className="object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-asphalt via-asphalt/80 to-asphalt" />
      </div>
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5" data-reveal>
          <h2 id={`${id}-title`} className="text-[clamp(2.4rem,1.4rem+4.2vw,4.8rem)] leading-[0.98]">
            {t("home.finalCta.title")}
          </h2>
          <p className="mt-6 max-w-md text-lead text-paper/80">{t("home.finalCta.body")}</p>
          <CtaRow locale={locale} book={false} className="mt-9" />
          <div className="card clip-reveal relative mt-10 hidden aspect-[16/9] max-w-md overflow-hidden lg:block" style={{ ["--curtain" as string]: "#FFC72C" }}>
            <SmartImage src={IMG.keys} alt={t("home.finalCta.imageAlt")} fill sizes="30vw" className="object-cover" />
          </div>
          <p className="mt-6 text-sm text-slate">{t("common.otherLanguages")}</p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7" data-reveal>
          <BookingForm services={services} idPrefix={id} />
        </div>
      </div>
    </section>
  );
}
