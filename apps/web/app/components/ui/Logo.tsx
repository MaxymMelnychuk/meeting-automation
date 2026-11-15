export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden className={className}>
      <defs>
        <radialGradient id="lg" cx="38%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="100%" stopColor="#505050" />
        </radialGradient>
      </defs>
      <rect x="4" y="7" width="28" height="25" rx="5" stroke="url(#lg)" strokeWidth="1.8" fill="none" />
      <rect x="4" y="7" width="28" height="9" rx="5" fill="url(#lg)" opacity="0.28" />
      <line x1="11" y1="3" x2="11" y2="10" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="3" x2="25" y2="10" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="11" cy="22" r="1.6" fill="rgba(255,255,255,0.72)" />
      <circle cx="18" cy="22" r="1.6" fill="rgba(255,255,255,0.50)" />
      <circle cx="25" cy="22" r="1.6" fill="rgba(255,255,255,0.30)" />
      <circle cx="11" cy="28" r="1.6" fill="rgba(255,255,255,0.40)" />
      <circle cx="18" cy="28" r="1.6" fill="rgba(255,255,255,0.68)" />
    </svg>
  )
}
