import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { business } from "@/config/site";
import { routing } from "@/i18n/routing";

export const dynamic = "force-static";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const COPY: Record<string, { title: string; sub: string; langs: string }> = {
  en: { title: "Learn to drive with confidence.", sub: "Patient, bilingual instructors · North Plainfield, NJ", langs: "Hablamos Español · We Speak English" },
  es: { title: "Aprende a manejar con confianza.", sub: "Instructores pacientes que hablan tu idioma · North Plainfield, NJ", langs: "Hablamos Español · We Speak English" },
};

/** Branded 1200×630 Open Graph image per language: /og/en, /og/es */
export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = COPY[locale] ?? COPY.en;
  const font = await readFile(path.join(process.cwd(), "src/assets/bricolage-800.woff"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#0E1116", color: "#F6F4EE", padding: "64px 72px", fontFamily: "Bricolage", position: "relative" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 150, height: 8, display: "flex", backgroundImage: "repeating-linear-gradient(90deg, #FFC72C 0 60px, transparent 60px 104px)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: "#FFC72C", color: "#0E1116", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>JK</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38 }}>JK Speedy</div>
            <div style={{ fontSize: 20, color: "#8A94A6", letterSpacing: 3 }}>DRIVING SCHOOL</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginBottom: 70 }}>
          <div style={{ fontSize: 80, lineHeight: 1, letterSpacing: -2, maxWidth: 1000 }}>{c.title}</div>
          <div style={{ fontSize: 30, color: "#C9CED8", marginTop: 22 }}>{c.sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28 }}>
          <div style={{ color: "#FFC72C" }}>{business.phoneDisplay}</div>
          <div style={{ color: "#8A94A6" }}>{c.langs}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: [{ name: "Bricolage", data: font, weight: 800, style: "normal" }] },
  );
}
