import { getTranslations } from "next-intl/server";
import { IMG } from "@/config/images";
import { Icon, type IconName } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { TiltCard } from "@/components/ui/TiltCard";
import { CountUp } from "@/components/ui/CountUp";
import { Speedometer } from "@/components/ui/Speedometer";

const ICONS: IconName[] = ["globe", "heart", "wallet", "route"];

export async function WhySection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const items = t.raw("home.why.items") as { title: string; body: string }[];
  const stats = t.raw("home.stats.items") as { value: number; suffix: string; label: string; note: string }[];
  return (
    <section className="on-light bg-paper py-24 sm:py-32" aria-labelledby="why-title">
      <div className="container-x">
        <SectionHeading id="why-title" eyebrow={t("home.why.eyebrow")} title={t("home.why.title")} intro={t("home.why.intro")} />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => (
            <li key={i} data-reveal style={{ ["--d" as string]: i }}>
              <TiltCard className="card h-full border border-line bg-white p-7 shadow-[0_1px_0_rgba(14,17,22,.04),0_20px_40px_-28px_rgba(14,17,22,.35)]">
                <span className="grid size-12 place-items-center rounded-2xl bg-asphalt text-yellow">
                  <Icon name={ICONS[i]} className="size-6" />
                </span>
                <h3 className="mt-6 text-h3">{it.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">{it.body}</p>
              </TiltCard>
            </li>
          ))}
        </ul>

        {/* Nervous-driver block */}
        <div className="card mt-20 grid overflow-hidden bg-asphalt text-paper lg:grid-cols-2" data-reveal>
          <div className="clip-reveal relative min-h-[300px] lg:min-h-[480px]" style={{ ["--curtain" as string]: "#FFC72C" }}>
            <SmartImage src={IMG.nervous} alt={t("home.why.nervous.imageAlt")} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <Speedometer className="absolute end-6 top-6 size-20 text-paper opacity-60" value={0.25} />
            <h2 className="max-w-md text-h2">{t("home.why.nervous.title")}</h2>
            <p className="mt-5 max-w-lg text-lead text-slate">{t("home.why.nervous.body")}</p>
            <NavLink href={{ pathname: "/services", hash: t("services.items.nervous.anchor") }} className="btn btn-primary mt-8 self-start">
              {t("home.why.nervous.cta")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
            </NavLink>
          </div>
        </div>

        {/* Verified facts only */}
        <h2 className="sr-only">{t("home.stats.title")}</h2>
        <dl className="mt-20 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="border-s-2 border-dashed border-asphalt/25 ps-5" data-reveal style={{ ["--d" as string]: i }}>
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block font-display text-[clamp(2.75rem,2rem+3vw,4.5rem)] font-extrabold leading-none tracking-tight">
                  <CountUp value={s.value} suffix={s.suffix} />
                </span>
                <span className="mt-2 block font-semibold" aria-hidden="true">{s.label}</span>
                <span className="mt-1 block text-sm text-ink-muted">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
