"use client";

import { useEffect, useState } from "react";

const SCHEDULE: Record<number, [number, number] | null> = {
  0: null,
  1: [9, 20],
  2: [9, 20],
  3: [9, 20],
  4: [9, 20],
  5: [9, 20],
  6: [9, 13],
};

/** Live "Open now / Closed now" in America/New_York. Rendered client-only to avoid hydration mismatch. */
export function OpenStatus({ openLabel, closedLabel, tone = "dark" }: { openLabel: string; closedLabel: string; tone?: "dark" | "light" }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const calc = () => {
      const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
      const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
      const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
      const min = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
      const slot = SCHEDULE[wd];
      const t = h + min / 60;
      setOpen(!!slot && t >= slot[0] && t < slot[1]);
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, []);
  if (open === null) return <span className="inline-block h-6 w-24" aria-hidden="true" />;
  const dotColor = open ? "bg-green" : "bg-slate";
  const text = tone === "dark" ? "text-paper" : "text-asphalt";
  return (
    <span className={`inline-flex h-6 items-center gap-2 text-sm font-semibold ${text}`}>
      <span className="relative flex size-2.5">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60 motion-reduce:hidden" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${dotColor}`} />
      </span>
      {open ? openLabel : closedLabel}
    </span>
  );
}
