import type { MetadataRoute } from "next";
import { routing, type AppPathname } from "@/i18n/routing";
import { absUrl, alternatesFor } from "@/lib/seo";

const PRIORITY: Partial<Record<AppPathname, number>> = { "/": 1, "/services": 0.9, "/contact": 0.9, "/nj-license-guide": 0.8 };

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-11-24");
  const paths = Object.keys(routing.pathnames) as AppPathname[];
  return paths.flatMap((href) =>
    routing.locales.map((locale) => ({
      url: absUrl(locale, href),
      lastModified,
      changeFrequency: href === "/" ? "weekly" : "monthly",
      priority: PRIORITY[href] ?? (href === "/privacy" || href === "/terms" ? 0.2 : 0.6),
      alternates: { languages: alternatesFor(href) },
    })),
  );
}
