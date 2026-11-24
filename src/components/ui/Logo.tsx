export function LogoMark({ className = "size-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <rect width="48" height="48" rx="13" fill="#FFC72C" />
      <path d="M6 31h7M4 26h6M7 21h5" stroke="#0E1116" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M22.5 13v15.2c0 3.6-2 5.8-5.6 5.8-1.2 0-2.3-.2-3.1-.6l.6-3.6c.6.2 1.2.3 1.8.3 1.3 0 1.9-.7 1.9-2.4V13h4.4Zm4.6 0h4.4v8.1l6.8-8.1h5.2l-7.1 8 7.5 12.6h-5.2l-5.3-9.3-1.9 2.2v7.1h-4.4V13Z" fill="#0E1116" />
    </svg>
  );
}

export function Logo({ tagline }: { tagline?: string }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="size-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-extrabold tracking-tight">JK Speedy</span>
        <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-slate min-[400px]:text-[0.68rem] min-[400px]:tracking-[0.14em]">{tagline ?? "Driving School"}</span>
      </span>
    </span>
  );
}
