import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/site";
import { IMG } from "@/config/images";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SmartImage } from "@/components/ui/SmartImage";
import { Speedometer } from "@/components/ui/Speedometer";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "about", "/about");
}

const LANGS = [
  { code: "es", label: "Español" },
  { code: "en", label: "English" },
  { code: "pt", label: "Português" },
  { code: "ar", label: "العربية", dir: "rtl" },
];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const safety = t.raw("about.safety") as string[];

  return (
    <>
      <PageHero
        locale={locale}
        href="/about"
        crumb={t("nav.about")}
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        intro={t("about.intro")}
        image={IMG.scenic}
        imageAlt={t("about.heroAlt")}
      />

      <section className="on-light bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-8 lg:grid-cols-2">
          <article className="confirm-block card p-8 sm:p-10" data-reveal>
            <ConfirmBadge label={t("about.storyTitle")} />
            <h2 className="mt-5 text-h2">{t("about.storyTitle")}</h2>
            <p className="mt-4 text-lead text-ink-muted">{t("about.story")}</p>
          </article>
          <article className="card relative overflow-hidden bg-asphalt p-8 text-paper sm:p-10" data-reveal style={{ ["--d" as string]: 1 }}>
            <Speedometer className="absolute -end-6 -top-6 size-40 text-paper opacity-30" value={0.85} />
            <h2 className="text-h2">{t("about.missionTitle")}</h2>
            <p className="mt-4 max-w-lg text-lead text-paper/85">{t("about.mission")}</p>
          </article>
        </div>
      </section>

      <section className="on-light bg-paper-2 py-20 sm:py-28" aria-labelledby="team-h">
        <div className="container-x">
          <SectionHeading id="team-h" title={t("about.instructorsTitle")} intro={t("about.instructorsIntro")} />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n, i) => (
              <li key={n} className="confirm-block card overflow-hidden" data-reveal style={{ ["--d" as string]: i }}>
                <div className="grid aspect-[4/3] place-items-center bg-paper-2 text-ink-muted">
                  <svg viewBox="0 0 24 24" className="size-16 opacity-40" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
                  </svg>
                </div>
                <div className="p-6">
                  <ConfirmBadge label="Photo, name & bio" />
                  <h3 className="mt-4 text-h3">{t("about.instructorPlaceholder")}</h3>
                  <p className="mt-1 text-sm font-semibold text-ink-muted">{t("about.instructorRole")}</p>
                  <p className="mt-3 text-ink-muted">{t("about.instructorBio")}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-light bg-paper py-20 sm:py-28">
        <div className="container-x grid gap-6 lg:grid-cols-3">
          <article className="card border border-line bg-white p-8" data-reveal>
            <span className="grid size-12 place-items-center rounded-2xl bg-asphalt text-yellow">
              <Icon name="globe" className="size-6" />
            </span>
            <h2 className="mt-6 text-h3">{t("about.languagesTitle")}</h2>
            <p className="mt-3 text-ink-muted">{t("about.languagesBody")}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {LANGS.map((l) => (
                <li key={l.code} lang={l.code} dir={l.dir ?? "ltr"} className="rounded-full bg-paper-2 px-3.5 py-1.5 text-sm font-semibold">
                  {l.label}
                </li>
              ))}
            </ul>
          </article>
          <article className="card overflow-hidden border border-line bg-white" data-reveal style={{ ["--d" as string]: 1 }}>
            <div className="clip-reveal relative aspect-[16/9] bg-asphalt-2">
              <SmartImage src={IMG.instructor} alt={t("about.carImageAlt")} fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover" />
              <span className="absolute end-3 top-3 z-[3] rounded-full bg-asphalt/70 px-2.5 py-0.5 text-[0.7rem] text-paper/85">{t("about.photoNote")}</span>
            </div>
            <div className="p-8">
              <h2 className="text-h3">{t("about.carTitle")}</h2>
              <p className="mt-3 text-ink-muted">{t("about.carBody")}</p>
              <p className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold">{t("about.carModel")}:</span> <ConfirmBadge label="Make / model" />
              </p>
            </div>
          </article>
          <article className="card bg-asphalt p-8 text-paper" data-reveal style={{ ["--d" as string]: 2 }}>
            <span className="grid size-12 place-items-center rounded-2xl bg-yellow text-asphalt">
              <Icon name="shield" className="size-6" />
            </span>
            <h2 className="mt-6 text-h3">{t("about.safetyTitle")}</h2>
            <ul className="mt-5 space-y-3">
              {safety.map((s, i) => (
                <li key={i} className="flex gap-3 text-paper/90">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-green" /> {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate">
              {t("about.licenseNumber")}: {business.mvcLicenseNumber ?? <ConfirmBadge label="License #" />}
            </p>
          </article>
        </div>
      </section>

      <FinalCta locale={locale} id="book-about" />
    </>
  );
}
