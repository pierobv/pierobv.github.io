import { useRef, useState } from 'react'
import { useFlicker } from '../hooks/useFlicker'
import { useLanguage } from '../i18n/language'
import { prefersReducedMotion } from '../motion'
import { useTheme } from '../theme/useTheme'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * The theme switch, fixed at the top center of the screen.
 * Dark mode is lit by a torch, light mode by the sun. Clicking swaps them:
 * 1. the current object rises out of view;
 * 2. the new light spreads in a circle from the top center (useTheme);
 * 3. the new object comes down into place.
 *
 * Next to the button lives the light layer: firelight in dark mode (follows --flicker/--sway
 * from useFlicker, so it moves with the flame) and sunlight in light mode.
 */
export function ThemeSwitch() {
  const { theme, switchTheme } = useTheme()
  const { t } = useLanguage()
  // 'up' = out of view above the screen, 'down' = hanging in place.
  const [position, setPosition] = useState<'up' | 'down'>('down')
  const sceneRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Ignores clicks while an animation is running, so they can't pile up.
  const busy = useRef(false)

  const isDark = theme === 'dark'
  useFlicker(sceneRef, isDark)
  const label = isDark ? t.switchToLight : t.switchToDark

  const handleClick = async () => {
    if (busy.current || !buttonRef.current) return
    busy.current = true
    try {
      const rect = buttonRef.current.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      if (!prefersReducedMotion()) {
        setPosition('up')
        await wait(380) // matches the CSS transition
      }
      // The new object is drawn already "up" and comes down as the new light spreads.
      await switchTheme(isDark ? 'light' : 'dark', x, y, () => setPosition('down'))
    } finally {
      busy.current = false
    }
  }

  return (
    <div className="sky" ref={sceneRef} data-position={position}>
      <div className="firelight" aria-hidden="true" />
      <div className="sunlight" aria-hidden="true" />
      <button
        ref={buttonRef}
        type="button"
        className="sky-button"
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        <span className="sky-object">{isDark ? <TorchIcon /> : <SunIcon />}</span>
      </button>
    </div>
  )
}

function TorchIcon() {
  return (
    <svg className="torch-svg" viewBox="0 0 32 64" aria-hidden="true">
      {/* Flame: an outer, middle and inner layer, each a smaller copy of the same teardrop. */}
      <g className="flame">
        <path className="flame-outer" d="M16 1 C20 8 25 13 24.2 20 C23.6 25 20.2 28 16 28 C11.8 28 8.4 25 7.8 20 C7 13 12 8 16 1 Z" />
        <path className="flame-middle" d="M16 8 C19 13 21.6 16.5 21 21 C20.6 24.6 18.6 27 16 27 C13.4 27 11.4 24.6 11 21 C10.4 16.5 13 13 16 8 Z" />
        <path className="flame-inner" d="M16 15 C17.8 18 19 20 18.6 22.6 C18.3 24.8 17.3 26.2 16 26.2 C14.7 26.2 13.7 24.8 13.4 22.6 C13 20 14.2 18 16 15 Z" />
      </g>
      <circle className="ember ember-1" cx="14" cy="10" r="0.9" />
      <circle className="ember ember-2" cx="18" cy="12" r="0.7" />
      <circle className="ember ember-3" cx="16" cy="8" r="0.6" />
      {/* Wrapped head, metal collar and a tapered wooden handle. */}
      <rect className="torch-head" x="10" y="25" width="12" height="9" rx="3" />
      <path className="torch-wrap" d="M10.5 28.5 H21.5 M10.5 31.5 H21.5" />
      <rect className="torch-collar" x="11" y="34" width="10" height="3" rx="1" />
      <path className="torch-handle" d="M12.6 37 H19.4 L17.6 63 H14.4 Z" />
    </svg>
  )
}

// Eight rays, generated instead of written out by hand.
const rays = Array.from({ length: 8 }, (_, i) => i * 45)

function SunIcon() {
  return (
    <svg className="sun-svg" viewBox="0 0 40 40" aria-hidden="true">
      <g className="sun-rays">
        {rays.map((angle) => (
          <line key={angle} x1="20" y1="3" x2="20" y2="8" transform={`rotate(${angle} 20 20)`} />
        ))}
      </g>
      <circle className="sun-core" cx="20" cy="20" r="8" />
    </svg>
  )
}
