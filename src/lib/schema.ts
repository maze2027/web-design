import { business, SITE_URL, SERVICE_IDS } from "@/config/site";
import type { Locale } from "@/i18n/routing";
import { HREFLANG } from "@/i18n/routing";

const BUSINESS_ID = `${SITE_URL}/#business`;

const AREAS = [
  "North Plainfield", "Plainfield", "South Plainfield", "Green Brook", "Dunellen",
  "Watchung", "Scotch Plains", "Fanwood", "Berkeley Heights", "Bound Brook",
];

/** LocalBusiness + EducationalOrganization. No AggregateRating until real review data exists. */
export function businessSchema(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    "@id": BUSINESS_ID,
    name: business.name,
    description,
    url: `${SITE_URL}/${locale}`,
    telephone: business.phoneE164,
    image: `${SITE_URL}/og/${locale}`,
    logo: `${SITE_URL}/icons/icon-512.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.streetSchema,
      addressLocality: business.address.city,
      addressRegion: business.address.region,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: business.geo.lat, longitude: business.geo.lng },
    hasMap: business.listings.google,
    openingHoursSpecification: business.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens,
      closes: h.closes,
    })),
    areaServed: [
      ...AREAS.map((name) => ({ "@type": "City", name: `${name}, NJ` })),
      { "@type": "AdministrativeArea", name: "Somerset County, NJ" },
      { "@type": "AdministrativeArea", name: "Union County, NJ" },
    ],
    knowsLanguage: ["en", "es", "pt", "ar"],
    sameAs: [business.listings.yelp, ...(business.social.facebook ? [business.social.facebook] : []), ...(business.social.instagram ? [business.social.instagram] : [])],
  };
}

export function websiteSchema(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: business.name,
    inLanguage: HREFLANG[locale],
    publisher: { "@id": BUSINESS_ID },
  };
}

export function servicesSchema(locale: Locale, items: Record<string, { name: string; short: string; anchor: string }>, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": SERVICE_IDS.map((id) => ({
      "@type": "Service",
      "@id": `${pageUrl}#${items[id].anchor}`,
      name: items[id].name,
      description: items[id].short,
      serviceType: "Driving instruction",
      url: `${pageUrl}#${items[id].anchor}`,
      provider: { "@id": BUSINESS_ID },
      areaServed: { "@type": "State", name: "New Jersey" },
      availableLanguage: ["en", "es", "pt", "ar"],
      inLanguage: HREFLANG[locale],
    })),
  };
}

export function faqSchema(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })),
  };
}

export function articleSchema(locale: Locale, headline: string, description: string, url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    inLanguage: HREFLANG[locale],
    mainEntityOfPage: url,
    dateModified: "2026-11-01",
    author: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    citation: business.mvcUrl,
  };
}
