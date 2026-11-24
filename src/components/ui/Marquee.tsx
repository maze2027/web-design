"use client";

import { useState } from "react";

const ITEMS = [
  { text: "Hablamos Español", lang: "es", dir: "ltr" },
  { text: "We Speak English", lang: "en", dir: "ltr" },
  { text: "Falamos Português", lang: "pt", dir: "ltr" },
  { text: "نتحدث العربية", lang: "ar", dir: "rtl" },
] as const;

function Row({ dup = false }: { dup?: boolean }) {
  return (
    <ul className={`flex shrink-0 items-center ${dup ? "marquee-dup" : ""}`} aria-hidden={dup || undefined}>
      {[...ITEMS, ...ITEMS].map((it, i) => (
        <li key={i} className="flex items-center whitespace-nowrap">
          <span lang={it.lang} dir={it.dir} className="px-6 font-display text-[clamp(1.25rem,1rem+1.2vw,2rem)] font-extrabold tracking-tight sm:px-9">
            {it.text}
          </span>
          <span aria-hidden="true" className="block h-[6px] w-10 rounded-full bg-asphalt/80" />
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite language marquee. Pauses on hover/focus, has an explicit pause
 * control (WCAG 2.2.2) and becomes a static, wrapped list under reduced motion.
 */
export function Marquee({ label, pauseLabel, playLabel }: { label: string; pauseLabel: string; playLabel: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-label={label} className="marquee relative overflow-hidden bg-yellow py-5 text-asphalt sm:py-6" dir="ltr" data-paused={paused}>
      <div className="marquee-track flex w-max">
        <Row />
        <Row dup />
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-pressed={paused}
        className="absolute end-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-asphalt text-yellow shadow-lg motion-reduce:hidden"
      >
        <span className="sr-only">{paused ? playLabel : pauseLabel}</span>
        <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
          {paused ? <path d="M8 5.5v13l10.5-6.5L8 5.5Z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
        </svg>
      </button>
    </section>
  );
}
