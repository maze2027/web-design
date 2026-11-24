import { getTranslations } from "next-intl/server";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { NavLink } from "@/components/ui/NavLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function FaqPreview({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const items = (t.raw("faq.items") as { q: string; a: string }[]).slice(0, 5);
  return (
    <section className="on-light bg-paper-2 py-24 sm:py-32" aria-labelledby="faqp-title">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faqp-title" eyebrow={t("home.faqPreview.eyebrow")} title={t("home.faqPreview.title")} />
          <NavLink href="/faq" className="btn btn-dark mt-8">
            {t("home.faqPreview.cta")} <Icon name="arrow" className="size-5 rtl:-scale-x-100" />
          </NavLink>
        </div>
        <div className="lg:col-span-8" data-reveal>
          <Accordion items={items} />
        </div>
      </div>
    </section>
  );
}
