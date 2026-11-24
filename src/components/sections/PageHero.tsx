import type { ReactNode } from "react";
import type { AppPathname, Locale } from "@/i18n/routing";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { RoadLine } from "@/components/ui/RoadLine";
import { SmartImage } from "@/components/ui/SmartImage";

/** Dark page hero shared by inner pages: breadcrumbs, single <h1>, intro, optional photo. */
export async function PageHero({
  locale,
  href,
  crumb,
  eyebrow,
  title,
  intro,
  image,
  imageAlt,
  children,
}: {
  locale: Locale;
  href: AppPathname;
  crumb: string;
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-asphalt pt-32 text-paper sm:pt-36">
      <div className="speed-lines" aria-hidden="true">
        <span style={{ top: "24%", animationDelay: "0.4s" }} />
        <span style={{ top: "58%", animationDelay: "2.2s" }} />
      </div>
      <div className="container-x relative grid items-end gap-10 pb-10 lg:grid-cols-12">
        <div className={image ? "lg:col-span-7" : "lg:col-span-9"}>
          <div className="hero-fade" style={{ ["--i" as string]: 0 }}>
            <Breadcrumbs locale={locale} current={crumb} href={href} />
          </div>
          <p className="eyebrow mt-8 text-yellow hero-fade" style={{ ["--i" as string]: 1 }}>
            {eyebrow}
          </p>
          <h1 className="mask-line hero-line mt-4 text-h1">
            <span>{title}</span>
          </h1>
          <p className="hero-rise mt-6 max-w-2xl text-lead text-slate">
            {intro}
          </p>
          {children && (
            <div className="hero-fade mt-8" style={{ ["--i" as string]: 3 }}>
              {children}
            </div>
          )}
        </div>
        {image && (
          <div className="relative lg:col-span-5">
            <div className="card relative aspect-[4/3] overflow-hidden bg-asphalt-2">
              <SmartImage src={image} alt={imageAlt ?? ""} fill priority sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-asphalt/50 to-transparent" aria-hidden="true" />
            </div>
          </div>
        )}
      </div>
      <RoadLine id={`road-${href.replace(/\W/g, "") || "home"}`} className="h-20 sm:h-24" />
      <div className="h-6 bg-gradient-to-b from-asphalt to-paper" aria-hidden="true" />
    </section>
  );
}
