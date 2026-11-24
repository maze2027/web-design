/** Decorative speedometer arc (brand motif). `value` 0–1 fills the yellow arc. */
export function Speedometer({ value = 0.72, className = "size-24" }: { value?: number; className?: string }) {
  const r = 40;
  const arc = Math.PI * r * 1.5; // 270° gauge
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(135 50 50)">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arc} 999`} />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#FFC72C" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${arc * value} 999`} />
      </g>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = ((135 + (270 / 9) * i) * Math.PI) / 180;
        return <line key={i} x1={50 + Math.cos(a) * 28} y1={50 + Math.sin(a) * 28} x2={50 + Math.cos(a) * 31.5} y2={50 + Math.sin(a) * 31.5} stroke="currentColor" strokeOpacity=".45" strokeWidth="1.6" strokeLinecap="round" />;
      })}
      <line x1="50" y1="50" x2={50 + Math.cos(((135 + 270 * value) * Math.PI) / 180) * 24} y2={50 + Math.sin(((135 + 270 * value) * Math.PI) / 180) * 24} stroke="#FFC72C" strokeWidth="3" strokeLinecap="round" />
      <circle cx="50" cy="50" r="4.5" fill="#FFC72C" />
    </svg>
  );
}
