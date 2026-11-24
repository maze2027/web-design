import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { Marquee } from "@/components/ui/Marquee";
import { HomeHero } from "@/components/sections/HomeHero";
import { WhySection } from "@/components/sections/WhySection";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Journey } from "@/components/sections/Journey";
import { NjSteps } from "@/components/sections/NjSteps";
import { Reviews } from "@/components/sections/Reviews";
import { AreasPreview } from "@/components/sections/AreasPreview";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { FinalCta } from "@/components/sections/FinalCta";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata(locale, "home", "/");
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  return (
    <>
      <HomeHero locale={locale} />
      <Marquee label={t("home.marqueeLabel")} pauseLabel={t("common.pause")} playLabel={t("common.play")} />
      <WhySection locale={locale} />
      <ServicesPreview locale={locale} />
      <Journey
        eyebrow={t("home.journey.eyebrow")}
        title={t("home.journey.title")}
        intro={t("home.journey.intro")}
        steps={t.raw("home.journey.steps") as { title: string; body: string; tip: string }[]}
        progressLabel={t.raw("home.journey.progressLabel") as string}
      />
      <NjSteps locale={locale} />
      <Reviews locale={locale} />
      <AreasPreview locale={locale} />
      <FaqPreview locale={locale} />
      <FinalCta locale={locale} />
    </>
  );
}
