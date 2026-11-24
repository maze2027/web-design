import { getTranslations } from "next-intl/server";
import type { AppPathname, Locale } from "@/i18n/routing";
import { PageHero } from "./PageHero";
import { ConfirmBadge } from "@/components/ui/Confirm";

export async function LegalPage({ locale, kind, href }: { locale: Locale; kind: "privacy" | "terms"; href: AppPathname }) {
  const t = await getTranslations({ locale });
  const sections = t.raw(`legal.${kind}.sections`) as { title: string; body: string }[];
  return (
    <>
      <PageHero locale={locale} href={href} crumb={t(`nav.${kind}`)} eyebrow={t(`nav.${kind}`)} title={t(`legal.${kind}.title`)} intro={t(`legal.${kind}.updated`)} />
      <section className="on-light bg-paper py-16 sm:py-24">
        <div className="container-x max-w-3xl">
          <p className="confirm-block card flex flex-wrap items-center gap-3 p-4 text-sm">
            <ConfirmBadge label="Legal review" /> {t(`legal.${kind}.draftNote`)}
          </p>
          {sections.map((s, i) => (
            <section key={i} className="mt-10">
              <h2 className="text-h3">{s.title}</h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed text-asphalt/85">{s.body}</p>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
