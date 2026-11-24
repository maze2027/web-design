import { getTranslations } from "next-intl/server";
import { business } from "@/config/site";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * [CONFIRM] Three clearly-labeled sample slots. Replace each with a REAL review
 * (first name, text, source link). Never invent reviews or star ratings, and
 * don't add AggregateRating schema until real numbers are supplied.
 */
export async function Reviews({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  return (
    <section className="on-light bg-paper-2 py-24 sm:py-32" aria-labelledby="reviews-title">
      <div className="container-x">
        <SectionHeading id="reviews-title" eyebrow={t("home.reviews.eyebrow")} title={t("home.reviews.title")} intro={t("home.reviews.intro")} />
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <li key={n} data-reveal style={{ ["--d" as string]: i }} className="confirm-block card flex flex-col p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ConfirmBadge label={`${t("home.reviews.sampleLabel")} ${n}`} />
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Google / Yelp</span>
              </div>
              <p className="mt-6 flex-1 text-[1.05rem] leading-relaxed text-ink-muted">{t("home.reviews.samplePlaceholder")}</p>
              <p className="mt-6 font-semibold text-asphalt">— {t("home.reviews.sampleName")}</p>
            </li>
          ))}
        </ul>
        <div className="card mt-8 flex flex-col gap-6 bg-asphalt p-8 text-paper sm:p-10 lg:flex-row lg:items-center lg:justify-between" data-reveal>
          <div>
            <h3 className="text-h3">{t("home.reviews.leaveTitle")}</h3>
            <p className="mt-2 text-slate">{t("home.reviews.leaveBody")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a href={business.listings.googleReview} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Icon name="star" className="size-5" /> {t("home.reviews.google")}
              <span className="sr-only">{t("common.external")}</span>
            </a>
            <a href={business.listings.yelp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
              {t("home.reviews.yelp")} <Icon name="external" className="size-4" />
              <span className="sr-only">{t("common.external")}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
