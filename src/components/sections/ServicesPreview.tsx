import { getTranslations } from "next-intl/server";
import { SERVICE_IDS, type ServiceId } from "@/config/site";
import { IMG, type ImgKey } from "@/config/images";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { TiltCard } from "@/components/ui/TiltCard";

export const SERVICE_IMAGES: Record<ServiceId, ImgKey> = {
  permit: "trafficLight",
  lessons: "hands",
  "road-test": "parking",
  nervous: "confident",
  teen: "teen",
  adult: "adult",
};

export async function ServicesPreview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <section className="on-light bg-paper-2 py-24 sm:py-32" aria-labelledby="services-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading id="services-title" eyebrow={t("home.servicesPreview.eyebrow")} title={t("home.servicesPreview.title")} intro={t("home.servicesPreview.intro")} />
          <NavLink href="/services" className="btn btn-dark shrink-0 self-start md:self-end">
            {t("home.servicesPreview.cta")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </NavLink>
        </div>
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICE_IDS.map((id, i) => (
            <li key={id} data-reveal style={{ ["--d" as string]: i % 3 }}>
              <TiltCard className="card group h-full overflow-hidden bg-white shadow-[0_24px_50px_-32px_rgba(14,17,22,.45)]" max={5}>
                <NavLink href={{ pathname: "/services", hash: t(`services.items.${id}.anchor`) }} className="flex h-full flex-col rounded-[24px]">
                  <div className="clip-reveal relative aspect-[16/10] overflow-hidden bg-asphalt-2">
                    <SmartImage
                      src={IMG[SERVICE_IMAGES[id]]}
                      alt={t(`services.items.${id}.imageAlt`)}
                      fill
                      sizes="(min-width:1024px) 30vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute start-4 top-4 z-[3] grid size-10 place-items-center rounded-full bg-yellow font-display text-sm font-extrabold text-asphalt">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <h3 className="text-h3">{t(`services.items.${id}.name`)}</h3>
                    <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{t(`services.items.${id}.short`)}</p>
                    <span className="mt-6 inline-flex items-center gap-2 font-semibold">
                      {t("common.learnMore")}
                      <Icon name="arrow" className="size-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </NavLink>
              </TiltCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
