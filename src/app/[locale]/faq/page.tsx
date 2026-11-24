import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { business } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { faqSchema } from "@/lib/schema";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/sections/PageHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Accordion } from "@/components/ui/Accordion";
import { CtaRow } from "@/components/ui/CtaRow";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "faq", "/faq");
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const items = t.raw("faq.items") as { q: string; a: string }[];
  return (
    <>
      <PageHero locale={locale} href="/faq" crumb={t("nav.faq")} eyebrow={t("faq.eyebrow")} title={t("faq.title")} intro={t("faq.intro")}>
        <CtaRow locale={locale} />
      </PageHero>
      <section className="on-light bg-paper py-16 sm:py-24" aria-label={t("faq.title")}>
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8" data-reveal>
            <Accordion items={items} />
          </div>
          <aside className="lg:col-span-4">
            <div className="card sticky top-28 border-2 border-dashed border-asphalt/20 p-6 text-sm leading-relaxed text-ink-muted">
              <p>
                <strong className="text-asphalt">{t("common.lastVerified")}.</strong> {t("common.mvcCheck")}
              </p>
              <p className="mt-3">{t("common.notLegalAdvice")}</p>
              <a href={business.mvcUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center font-semibold text-asphalt underline underline-offset-4">
                {t("common.mvcLink")}
                <span className="sr-only"> {t("common.external")}</span>
              </a>
            </div>
          </aside>
        </div>
      </section>
      <FinalCta locale={locale} id="book-faq" />
      <JsonLd data={faqSchema(items)} />
    </>
  );
}
