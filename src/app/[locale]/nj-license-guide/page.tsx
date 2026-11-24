import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/site";
import { IMG, type ImgKey } from "@/config/images";
import { absUrl, pageMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { CtaRow } from "@/components/ui/CtaRow";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SmartImage } from "@/components/ui/SmartImage";

type Props = { params: Promise<{ locale: Locale }> };
type Section = { id: string; title: string; paragraphs: string[]; bullets: string[] };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "guide", "/nj-license-guide");
}

// Decorative stock photos placed after specific sections (by index).
const INLINE_IMAGES: Record<number, ImgKey & ("crossing" | "highway" | "city")> = { 2: "crossing", 4: "highway", 5: "city" };

export default async function GuidePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const sections = t.raw("guide.sections") as Section[];
  const url = absUrl(locale, "/nj-license-guide");

  return (
    <>
      <PageHero
        locale={locale}
        href="/nj-license-guide"
        crumb={t("nav.guide")}
        eyebrow={t("guide.eyebrow")}
        title={t("guide.title")}
        intro={t("guide.intro")}
      >
        <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-asphalt-3 bg-asphalt-2 px-4 py-2 text-sm text-paper/85">
          <Icon name="shield" className="size-4 text-green" />
          {t("common.lastVerified")}
          <a href={business.mvcUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-yellow underline underline-offset-4">
            nj.gov/mvc
            <span className="sr-only"> {t("common.external")}</span>
          </a>
        </p>
      </PageHero>

      <div className="on-light bg-paper py-16 sm:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4 xl:col-span-3">
            <nav aria-label={t("guide.toc")} className="lg:sticky lg:top-28">
              <p className="eyebrow text-ink-muted">{t("guide.toc")}</p>
              <ol className="mt-4 space-y-1 border-s-2 border-dashed border-asphalt/20">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ms-[2px] flex min-h-11 items-center gap-3 border-s-2 border-transparent ps-4 text-[0.95rem] text-ink-muted hover:border-asphalt hover:text-asphalt">
                      <span className="font-display text-xs font-extrabold text-asphalt/50">{String(i + 1).padStart(2, "0")}</span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="lg:col-span-8 xl:col-span-8 xl:col-start-5">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="border-b border-line py-10 first:pt-0 last:border-0">
                <h2 id={`${s.id}-h`} className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] leading-tight">
                  {s.title}
                </h2>
                {s.paragraphs.map((p, k) => (
                  <p key={k} className="mt-4 max-w-[68ch] text-[1.075rem] leading-[1.75] text-asphalt/85">
                    {p}
                  </p>
                ))}
                {s.bullets.length > 0 && (
                  <ul className="mt-6 grid gap-3">
                    {s.bullets.map((b, k) => (
                      <li key={k} className="card flex gap-4 border border-line bg-white p-5 leading-relaxed">
                        <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-asphalt text-yellow">
                          <Icon name="check" className="size-4" />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                {INLINE_IMAGES[i] && (
                  <div className="card clip-reveal relative mt-8 aspect-[16/8] overflow-hidden bg-asphalt-2">
                    <SmartImage src={IMG[INLINE_IMAGES[i]]} alt={t(`guide.imageAlts.${INLINE_IMAGES[i]}`)} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover" />
                  </div>
                )}
              </section>
            ))}

            <div className="card mt-6 border-2 border-dashed border-asphalt/20 p-6 text-sm leading-relaxed text-ink-muted">
              <p>
                <strong className="text-asphalt">{t("common.lastVerified")}.</strong> {t("common.mvcCheck")} {t("common.notLegalAdvice")}
              </p>
              <a href={business.mvcUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 font-semibold text-asphalt underline underline-offset-4">
                {t("common.mvcLink")} <Icon name="external" className="size-4" />
                <span className="sr-only">{t("common.external")}</span>
              </a>
            </div>

            <div className="card mt-10 bg-asphalt p-8 text-paper sm:p-10">
              <h2 className="text-h3">{t("guide.helpTitle")}</h2>
              <p className="mt-2 text-slate">{t("guide.helpBody")}</p>
              <CtaRow locale={locale} className="mt-6" />
              <NavLink href="/services" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-yellow">
                {t("nav.services")} <Icon name="arrow" className="size-4 rtl:-scale-x-100" />
              </NavLink>
            </div>
          </article>
        </div>
      </div>
      <JsonLd data={articleSchema(locale, t("guide.title"), t("meta.guide.description"), url)} />
    </>
  );
}
