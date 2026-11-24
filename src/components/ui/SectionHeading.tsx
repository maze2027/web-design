import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "start",
  as: H = "h2",
  id,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  as?: "h1" | "h2";
  id?: string;
  children?: ReactNode;
}) {
  const muted = tone === "dark" ? "text-slate" : "text-ink-muted";
  const eyebrowColor = tone === "dark" ? "text-yellow" : "text-ink-muted";
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`} data-reveal>
      {eyebrow && <p className={`eyebrow ${eyebrowColor} ${align === "center" ? "justify-center" : ""}`}>{eyebrow}</p>}
      <H id={id} className={`mt-4 ${H === "h1" ? "text-h1" : "text-h2"}`}>
        {title}
      </H>
      {intro && <p className={`mt-5 text-lead ${muted}`}>{intro}</p>}
      {children}
    </div>
  );
}
