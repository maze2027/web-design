"use client";

import { m } from "framer-motion";
import { useId, useState } from "react";
import { Icon } from "./Icon";

type Item = { q: string; a: string };

/**
 * FAQ accordion. Answers always stay in the DOM (crawlable, findable with
 * Ctrl+F); collapsed panels are `inert` so they're skipped by keyboard and AT.
 */
export function Accordion({ items, tone = "light", defaultOpen = 0 }: { items: Item[]; tone?: "light" | "dark"; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();
  const dark = tone === "dark";
  return (
    <div className={`divide-y ${dark ? "divide-asphalt-3 border-asphalt-3" : "divide-line border-line"} border-y`}>
      {items.map((it, i) => {
        const isOpen = open === i;
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={i}>
            <h3 className="text-h3 font-bold">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={`group flex w-full items-start justify-between gap-6 py-6 text-start text-[1.08rem] leading-snug sm:text-[1.2rem] ${dark ? "" : "on-light"}`}
              >
                <span>{it.q}</span>
                <span
                  className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isOpen ? "rotate-180 bg-yellow text-asphalt" : dark ? "bg-asphalt-3 text-paper" : "bg-paper-2 text-asphalt"
                  }`}
                >
                  <Icon name="chevron" className="size-4" />
                </span>
              </button>
            </h3>
            <m.div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
              inert={!isOpen}
            >
              <p className={`max-w-3xl pb-7 pe-12 text-[1.02rem] leading-relaxed ${dark ? "text-slate" : "text-ink-muted"}`}>{it.a}</p>
            </m.div>
          </div>
        );
      })}
    </div>
  );
}
