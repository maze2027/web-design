/** Yellow dashed road line that "draws" across the section on load (mask + stroke-dashoffset). */
export function RoadLine({ id, className = "", d = "M-20 92 C 260 92, 420 30, 720 44 S 1180 104, 1460 58" }: { id: string; className?: string; d?: string }) {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 1440 120" preserveAspectRatio="xMidYMid slice" className={`pointer-events-none block w-full ${className}`}>
      <defs>
        <mask id={id} maskUnits="userSpaceOnUse" x="-40" y="0" width="1520" height="120">
          <path d={d} pathLength={1} stroke="#fff" strokeWidth="14" fill="none" className="draw-on-load" style={{ ["--len" as string]: 1 }} />
        </mask>
      </defs>
      <path d={d} stroke="#232A35" strokeWidth="34" fill="none" strokeLinecap="round" />
      <path d={d} stroke="#FFC72C" strokeWidth="4" fill="none" strokeDasharray="30 22" mask={`url(#${id})`} />
    </svg>
  );
}
