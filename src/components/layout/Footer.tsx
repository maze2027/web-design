import { getTranslations } from "next-intl/server";
import { business, mapLinks } from "@/config/site";
import type { AppPathname } from "@/i18n/routing";
import { NavLink } from "@/components/ui/NavLink";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { ConfirmBadge } from "@/components/ui/Confirm";
import { whatsappHref } from "@/config/site";

const LINKS: { href: AppPathname; key: string }[] = [
  { href: "/services", key: "services" },
  { href: "/nj-license-guide", key: "guide" },
  { href: "/about", key: "about" },
  { href: "/areas", key: "areas" },
  { href: "/faq", key: "faq" },
  { href: "/contact", key: "contact" },
  { href: "/privacy", key: "privacy" },
  { href: "/terms", key: "terms" },
];

export async function Footer({ locale }: { locale: string }) {
  const t = await getTranslations({ locale });
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden bg-asphalt pb-32 pt-20 text-paper md:pb-12">
      <div className="lane-divider absolute inset-x-0 top-0 opacity-90" aria-hidden="true" />
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Logo />
            <p className="mt-5 max-w-sm text-slate">{t("footer.tagline")}</p>
            <p className="mt-4 text-sm text-slate">{t("common.otherLanguages")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={business.phoneHref} className="btn btn-primary btn-sm">
                <Icon name="phone" className="size-4" /> {business.phoneDisplay}
              </a>
              <a href={whatsappHref(t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark btn-sm">
                <WhatsAppIcon className="size-4" /> {t("common.whatsapp")}
                <span className="sr-only">{t("common.external")}</span>
              </a>
            </div>
          </div>

          {/* NAP: identical to config/site.ts and the JSON-LD */}
          <div className="md:col-span-3">
            <h2 className="font-display text-base font-bold text-yellow">{t("footer.visit")}</h2>
            <address className="mt-4 not-italic leading-relaxed text-paper/90">
              <strong className="font-semibold text-paper">{business.name}</strong>
              <br />
              {business.address.street}
              <br />
              {business.address.city}, {business.address.region} {business.address.postalCode}
              <br />
              <a href={business.phoneHref} className="link-underline mt-1 inline-block font-semibold text-paper">
                {business.phoneDisplay}
              </a>
            </address>
            <a href={mapLinks.directions} target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-yellow">
              <Icon name="pin" className="size-4" /> {t("common.getDirections")}
              <span className="sr-only">{t("common.external")}</span>
            </a>
          </div>

          <div className="md:col-span-2">
            <h2 className="font-display text-base font-bold text-yellow">{t("hours.title")}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="text-slate">{t("hours.weekdaysLong")}</dt>
                <dd className="text-paper">{t("hours.weekdaysTime")}</dd>
              </div>
              <div>
                <dt className="text-slate">{t("hours.saturdayLong")}</dt>
                <dd className="text-paper">{t("hours.saturdayTime")}</dd>
              </div>
              <div>
                <dt className="text-slate">{t("hours.sundayLong")}</dt>
                <dd className="text-paper">{t("hours.closed")}</dd>
              </div>
            </dl>
          </div>

          <nav aria-label={t("common.footerNav")} className="md:col-span-3">
            <h2 className="font-display text-base font-bold text-yellow">{t("footer.explore")}</h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-6 text-sm">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <NavLink href={l.href} className="inline-flex min-h-11 items-center text-paper/85 hover:text-yellow">
                    {t(`nav.${l.key}`)}
                  </NavLink>
                </li>
              ))}
            </ul>
            <h2 className="mt-6 font-display text-base font-bold text-yellow">{t("footer.listings")}</h2>
            <ul className="mt-2 flex flex-wrap gap-x-5 text-sm">
              <li>
                <a href={business.listings.google} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-paper/85 hover:text-yellow">
                  {t("footer.google")} <Icon name="external" className="size-3.5" />
                  <span className="sr-only">{t("common.external")}</span>
                </a>
              </li>
              <li>
                <a href={business.listings.yelp} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-paper/85 hover:text-yellow">
                  {t("footer.yelp")} <Icon name="external" className="size-3.5" />
                  <span className="sr-only">{t("common.external")}</span>
                </a>
              </li>
              {!business.social.facebook && !business.social.instagram && (
                <li className="flex min-h-11 items-center">
                  <ConfirmBadge label="Social links" />
                </li>
              )}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-asphalt-3 pt-8 text-xs text-slate md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.name}. {t("footer.rights")}{" "}
            {business.mvcLicenseNumber ? (
              <span>
                {t("about.licenseNumber")} {business.mvcLicenseNumber}
              </span>
            ) : (
              <ConfirmBadge label="MVC license #" />
            )}
          </p>
          <p>{t("footer.stockNote")}</p>
        </div>
      </div>
    </footer>
  );
}
