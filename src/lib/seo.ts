import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { HREFLANG, OG_LOCALE, routing, type AppPathname, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/config/site";

export type PageKey = "home" | "services" | "guide" | "about" | "areas" | "faq" | "contact" | "privacy" | "terms";

export const absUrl = (locale: Locale, href: AppPathname) => `${SITE_URL}${getPathname({ locale, href })}`;

/** Reciprocal hreflang map (en-US, es-US, x-default). Built from routing so new locales are automatic. */
export function alternatesFor(href: AppPathname) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[HREFLANG[l]] = absUrl(l, href);
  languages["x-default"] = href === "/" ? `${SITE_URL}/` : absUrl(routing.defaultLocale, href);
  return languages;
}

export async function pageMetadata(locale: Locale, key: PageKey, href: AppPathname): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${key}.title`);
  const description = t(`${key}.description`);
  const url = absUrl(locale, href);
  const ogImage = `${SITE_URL}/og/${locale}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url, languages: alternatesFor(href) },
    openGraph: {
      type: "website",
      url,
      siteName: t("siteName"),
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [{ url: ogImage, width: 1200, height: 630, alt: t("siteName") }],
    },
    twitter: { card: "summary_large_image", title, description, images: [ogImage] },
  };
}
