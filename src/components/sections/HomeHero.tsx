import { getTranslations } from "next-intl/server";
import { IMG } from "@/config/images";
import { CtaRow } from "@/components/ui/CtaRow";
import { Icon, type IconName } from "@/components/ui/Icon";
import { OpenStatus } from "@/components/ui/OpenStatus";
import { RoadLine } from "@/components/ui/RoadLine";
import { SmartImage } from "@/components/ui/SmartImage";
import { Speedometer } from "@/components/ui/Speedometer";
import { HeroParallax } from "./HeroParallax";

const FACT_ICONS: IconName[] = ["globe", "clock", "heart"];

export async function HomeHero({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const lines = t.raw("home.hero.titleLines") as string[];
  const facts = t.raw("home.hero.facts") as string[];
  return (
    <section className="relative overflow-hidden bg-asphalt text-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_10%,rgba(255,199,44,.12),transparent_60%),radial-gradient(60%_50%_at_0%_100%,rgba(138,148,166,.14),transparent_60%)]" />
      <div className="speed-lines" aria-hidden="true">
        <span style={{ top: "18%", animationDelay: "0.2s" }} />
        <span style={{ top: "44%", animationDelay: "1.9s", inlineSize: "26%" }} />
        <span style={{ top: "71%", animationDelay: "3.4s" }} />
      </div>

      <div className="container-x relative grid gap-12 pb-6 pt-32 sm:pt-40 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-10 lg:pt-44">
        <div className="lg:col-span-7">
          <p className="eyebrow hero-fade text-yellow" style={{ ["--i" as string]: 0 }}>
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="mt-5 text-display">
            {lines.map((line, i) => (
              <span key={i} className={`mask-line hero-line ${i === lines.length - 1 ? "text-yellow" : ""}`} style={{ ["--i" as string]: i }}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-rise mt-7 max-w-xl text-lead text-paper/80">
            {t("home.hero.subtitle")}
          </p>
          <div className="hero-fade mt-9" style={{ ["--i" as string]: 2 }}>
            <CtaRow locale={locale} whatsapp={false} />
          </div>
          <ul className="hero-fade mt-10 flex flex-col gap-3 text-sm text-paper/80 sm:flex-row sm:flex-wrap sm:gap-x-7" style={{ ["--i" as string]: 3 }}>
            {facts.map((f, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-full bg-asphalt-3 text-yellow">
                  <Icon name={FACT_ICONS[i] ?? "check"} className="size-4" />
                </span>
                <span dir="auto">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative lg:col-span-5">
          <div className="card relative aspect-[4/3] overflow-hidden bg-asphalt-2 sm:aspect-[5/4] lg:aspect-[4/5]">
            <HeroParallax>
              <SmartImage src={IMG.hero} alt={t("home.hero.imageAlt")} fill priority fetchPriority="high" sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
            </HeroParallax>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-asphalt/70 via-transparent to-transparent" />
            <span className="absolute end-4 top-4 rounded-full bg-asphalt/70 px-3 py-1 text-[0.7rem] font-medium text-paper/80 backdrop-blur">{t("home.hero.imageNote")}</span>
          </div>
          {/* Floating status card with the speedometer motif */}
          <div className="hero-fade card absolute -bottom-6 start-4 flex items-center gap-4 border border-white/10 bg-asphalt/85 py-3 pe-6 ps-3 shadow-2xl backdrop-blur-xl sm:start-[-28px]" style={{ ["--i" as string]: 4 }}>
            <Speedometer className="size-16 text-paper" value={0.78} />
            <div>
              <OpenStatus openLabel={t("common.openNow")} closedLabel={t("common.closedNow")} />
              <p className="mt-0.5 text-xs text-slate">
                {t("hours.weekdays")} {t("hours.weekdaysTime")}
                <br />
                {t("hours.saturday")} {t("hours.saturdayTime")}
              </p>
            </div>
          </div>
        </div>
      </div>
      <RoadLine id="road-hero" className="mt-6 h-24 sm:h-28" />
    </section>
  );
}
