import { useId } from 'react'

// Flags drawn in SVG instead of emoji: Windows does not render flag emoji (it shows "GB" / "BR").
// `slice` makes both fill the same box even though their real proportions differ (2:1 and 10:7).

export function UkFlag() {
  // SVG ids are global to the page; useId keeps them unique if the flag is rendered twice.
  const clip = useId()
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <clipPath id={clip}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <rect width="60" height="30" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clip})`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

export function BrazilFlag() {
  return (
    <svg viewBox="0 0 20 14" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="20" height="14" fill="#009C3B" />
      <path d="M10,1.4 L18.4,7 L10,12.6 L1.6,7 z" fill="#FFDF00" />
      <circle cx="10" cy="7" r="3.4" fill="#002776" />
      <path d="M6.7,6.3 Q10,5.3 13.3,7.5" stroke="#fff" strokeWidth="0.6" fill="none" />
    </svg>
  )
}
