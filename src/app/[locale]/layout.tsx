import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { bricolage, inter } from "../fonts";
import { dirFor, HREFLANG, routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { RevealObserver } from "@/components/providers/RevealObserver";
import { ViewTransitionsProvider } from "@/components/providers/ViewTransitions";
import { JsonLd } from "@/components/seo/JsonLd";
import { businessSchema, websiteSchema } from "@/lib/schema";

export const viewport: Viewport = {
  themeColor: "#0E1116",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "JK Speedy Driving School",
  formatDetection: { telephone: false },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }, { url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/** Only the namespaces that client components need are serialized to the browser. */
const CLIENT_NAMESPACES = ["common", "language", "nav", "whatsapp", "form"] as const;

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]));
  const t = await getTranslations({ locale, namespace: "meta.home" });

  return (
    <html lang={HREFLANG[locale as Locale]} dir={dirFor(locale)} className={`${bricolage.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a href="#main" className="sr-only z-[100] rounded-full bg-yellow px-5 py-3 font-semibold text-asphalt focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
          {(messages.common as Record<string, string>).skip}
        </a>
        <NextIntlClientProvider locale={locale} messages={clientMessages}>
          <MotionProvider>
            <ViewTransitionsProvider>
              <ScrollProgress />
              <Header />
              <main id="main" tabIndex={-1} className="outline-none">
                {children}
              </main>
              <Footer locale={locale} />
              <MobileActionBar />
              <SmoothScroll />
              <RevealObserver />
            </ViewTransitionsProvider>
          </MotionProvider>
        </NextIntlClientProvider>
        <div id="lang-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />
        <JsonLd data={businessSchema(locale as Locale, t("description"))} />
        <JsonLd data={websiteSchema(locale as Locale)} />
      </body>
    </html>
  );
}
