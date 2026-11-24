import { getTranslations } from "next-intl/server";
import { business, whatsappHref } from "@/config/site";
import { Icon, WhatsAppIcon } from "./Icon";
import { Magnetic } from "./Magnetic";
import { NavLink } from "./NavLink";

/** The three primary conversion paths: Book · Call · WhatsApp. */
export async function CtaRow({ locale, tone = "dark", whatsapp = true, book = true, className = "" }: { locale: string; tone?: "dark" | "light"; whatsapp?: boolean; book?: boolean; className?: string }) {
  const t = await getTranslations({ locale });
  const ghost = tone === "dark" ? "btn-ghost-dark" : "btn-ghost-light";
  return (
    <div className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap ${className}`}>
      {book && (
      <Magnetic>
        <NavLink href={{ pathname: "/contact", hash: "book" }} className="btn btn-primary w-full sm:w-auto">
          <Icon name="calendar" className="size-5" /> {t("common.book")}
        </NavLink>
      </Magnetic>
      )}
      <Magnetic>
        <a href={business.phoneHref} className={`btn ${ghost} w-full sm:w-auto`}>
          <Icon name="phone" className="size-5" /> {t("common.callNumber", { phone: business.phoneDisplay })}
        </a>
      </Magnetic>
      {whatsapp && (
        <Magnetic>
          <a href={whatsappHref(t("whatsapp.prefill"))} target="_blank" rel="noopener noreferrer" className={`btn ${ghost} w-full sm:w-auto`}>
            <WhatsAppIcon className="size-5" /> {t("common.whatsapp")}
            <span className="sr-only">{t("common.external")}</span>
          </a>
        </Magnetic>
      )}
    </div>
  );
}
