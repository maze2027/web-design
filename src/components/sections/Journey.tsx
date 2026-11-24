"use client";

import { useEffect, useRef } from "react";
import { loadGsap } from "@/lib/gsap";
import { prefersReducedMotion, whenNear } from "@/lib/motion";

type Step = { title: string; body: string; tip: string };

// Five milestones spaced 220 units apart; every segment is the same curve,
// so milestone i sits exactly at i/4 of the path length.
const XS = [60, 280, 500, 720, 940];
const YS = [176, 76, 176, 76, 176];
const ROAD = XS.slice(1).reduce(
  (d, x, i) => `${d} C ${XS[i] + 110} ${YS[i]}, ${x - 110} ${YS[i + 1]}, ${x} ${YS[i + 1]}`,
  `M ${XS[0]} ${YS[0]}`,
);

/**
 * "Your Road to a License": a pinned section where the road draws as you
 * scroll and a car drives it, stopping at five milestones.
 * Progressive enhancement: without JS or with reduced motion it's a plain,
 * fully readable ordered list with the road already drawn.
 */
export function Journey({
  eyebrow,
  title,
  intro,
  steps,
  progressLabel,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  steps: Step[];
  progressLabel: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const maskRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const progressRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const path = pathRef.current;
    const mask = maskRef.current;
    const car = carRef.current;
    if (!section || !stage || !path || !mask || !car || prefersReducedMotion()) return;

    let cancelled = false;
    let revert: (() => void) | undefined;

    const stop = whenNear(section, () => {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;
        section.dataset.enhanced = "true";
        const len = path.getTotalLength();
        mask.style.strokeDasharray = `${len}`;
        const cards = Array.from(section.querySelectorAll<HTMLElement>(".journey-card"));
        const markers = Array.from(section.querySelectorAll<SVGGElement>(".journey-marker"));
        const labels = Array.from(section.querySelectorAll<HTMLElement>(".journey-label"));
        let active = -1;

        const update = (p: number) => {
          mask.style.strokeDashoffset = `${len * (1 - p)}`;
          const at = Math.max(0.001, Math.min(len - 0.001, len * p));
          const a = path.getPointAtLength(at);
          const b = path.getPointAtLength(Math.min(len, at + 2));
          const c = path.getPointAtLength(Math.max(0, at - 2));
          const angle = (Math.atan2(b.y - c.y, b.x - c.x) * 180) / Math.PI;
          car.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);
          const next = Math.min(steps.length - 1, Math.round(p * (steps.length - 1)));
          markers.forEach((m, i) => m.setAttribute("data-reached", String(i / (steps.length - 1) <= p + 0.02)));
          if (next !== active) {
            active = next;
            cards.forEach((el, i) => el.setAttribute("data-active", String(i === next)));
            labels.forEach((el, i) => el.setAttribute("data-active", String(i === next)));
            if (progressRef.current) {
              progressRef.current.textContent = progressLabel
                .replace("{current}", String(next + 1))
                .replace("{total}", String(steps.length));
            }
          }
        };

        const ctx = gsap.context(() => {
          ScrollTrigger.create({
            trigger: stage,
            start: "top top",
            end: () => `+=${Math.round(window.innerHeight * 3)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => update(self.progress),
          });
        }, section);
        update(0);
        ScrollTrigger.refresh();
        revert = () => {
          ctx.revert();
          delete section.dataset.enhanced;
          mask.style.strokeDasharray = "";
          mask.style.strokeDashoffset = "";
        };
      });
    }, "60% 0px");

    return () => {
      cancelled = true;
      stop();
      revert?.();
    };
  }, [steps.length, progressLabel]);

  return (
    <section ref={sectionRef} className="journey relative bg-asphalt text-paper" aria-labelledby="journey-title">
      <div className="container-x pt-24 sm:pt-32">
        <div className="max-w-3xl" data-reveal>
          <p className="eyebrow text-yellow">{eyebrow}</p>
          <h2 id="journey-title" className="mt-4 text-h2">
            {title}
          </h2>
          <p className="mt-5 text-lead text-slate">{intro}</p>
        </div>
      </div>

      <div ref={stageRef} className="journey-stage relative overflow-hidden">
        <div className="container-x flex flex-col justify-center pb-24 pt-12 [.journey[data-enhanced=true]_&]:min-h-svh [.journey[data-enhanced=true]_&]:pb-10 [.journey[data-enhanced=true]_&]:pt-24">
          <div className="relative">
            <svg viewBox="0 0 1000 250" className="-mx-2 block w-[calc(100%+16px)] overflow-visible sm:mx-0 sm:w-full" aria-hidden="true" focusable="false">
              <defs>
                <mask id="journey-mask" maskUnits="userSpaceOnUse" x="-50" y="-50" width="1100" height="350">
                  <path ref={maskRef} d={ROAD} stroke="#fff" strokeWidth="20" fill="none" />
                </mask>
              </defs>
              <path d={ROAD} stroke="#1C222B" strokeWidth="46" fill="none" strokeLinecap="round" />
              <path d={ROAD} stroke="#2A323E" strokeWidth="40" fill="none" strokeLinecap="round" />
              <path ref={pathRef} d={ROAD} stroke="none" fill="none" />
              <path d={ROAD} stroke="#FFC72C" strokeWidth="4" fill="none" strokeDasharray="22 16" mask="url(#journey-mask)" />
              {XS.map((x, i) => (
                <g key={i} className="journey-marker" data-reached="true" transform={`translate(${x} ${YS[i]})`}>
                  <circle r="30" fill="#0E1116" opacity=".55" />
                  <circle className="dot" r="22" fill="#232A35" stroke="#8A94A6" strokeWidth="3" />
                  <text textAnchor="middle" dy="8" fontSize="22" fontWeight="800" fill="#F6F4EE" fontFamily="var(--font-display)">
                    {i + 1}
                  </text>
                </g>
              ))}
              <g ref={carRef} className="journey-car opacity-0 transition-opacity duration-500 [.journey[data-enhanced=true]_&]:opacity-100" transform={`translate(${XS[0]} ${YS[0]})`}>
                <g transform="translate(-34 -18)">
                  <rect x="2" y="4" width="66" height="28" rx="10" fill="#000" opacity=".35" />
                  <rect width="66" height="32" rx="11" fill="#FFC72C" />
                  <rect x="40" y="5" width="13" height="22" rx="4" fill="#0E1116" />
                  <rect x="12" y="6" width="10" height="20" rx="3.5" fill="#0E1116" opacity=".8" />
                  <rect x="60" y="4" width="5" height="6" rx="2" fill="#F6F4EE" />
                  <rect x="60" y="22" width="5" height="6" rx="2" fill="#F6F4EE" />
                </g>
              </g>
            </svg>
            <ol className="pointer-events-none absolute inset-x-0 top-full mt-1 hidden md:block" aria-hidden="true">
              {steps.map((s, i) => (
                <li
                  key={i}
                  className="journey-label absolute w-[19%] -translate-x-1/2 text-center text-sm font-semibold text-slate transition-colors duration-300 data-[active=true]:text-yellow"
                  style={{ left: `${XS[i] / 10}%` }}
                >
                  {s.title}
                </li>
              ))}
            </ol>
          </div>

          <p ref={progressRef} aria-hidden="true" className="mt-6 hidden text-center text-sm font-semibold tracking-wide text-yellow md:mt-14 [.journey[data-enhanced=true]_&]:block" />

          <ol className="journey-cards mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 [.journey[data-enhanced=true]_&]:grid-cols-1 [.journey[data-enhanced=true]_&]:mx-auto [.journey[data-enhanced=true]_&]:mt-5 [.journey[data-enhanced=true]_&]:w-full [.journey[data-enhanced=true]_&]:max-w-2xl">
            {steps.map((s, i) => (
              <li key={i} className="journey-card card border border-asphalt-3 bg-asphalt-2 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-yellow font-display text-sm font-extrabold text-asphalt">{i + 1}</span>
                  <h3 className="text-h3">{s.title}</h3>
                </div>
                <p className="mt-4 leading-relaxed text-paper/85">{s.body}</p>
                <p className="mt-4 flex items-start gap-2 text-sm font-medium text-green">
                  <svg viewBox="0 0 24 24" className="mt-0.5 size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {s.tip}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
