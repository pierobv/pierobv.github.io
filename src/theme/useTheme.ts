import { useState } from 'react'
import { flushSync } from 'react-dom'
import { prefersReducedMotion } from '../motion'

// 'dark' is lit by the torch, 'light' by the sun.
export type Theme = 'light' | 'dark'

// The inline script in index.html already chose the theme before React loaded;
// here we just read what it decided so the two never disagree.
function currentTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // Storage blocked: the switch still works for this visit.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  /**
   * Changes the theme with a circle that grows from the point (x, y): the new light
   * spreads from where the sun or the torch is.
   * View Transitions API: the browser snapshots the old page, we change the theme, and we
   * animate the clip-path of the new snapshot. `onReady` runs once the animation has started.
   */
  const switchTheme = async (next: Theme, x: number, y: number, onReady?: () => void) => {
    if (prefersReducedMotion() || !('startViewTransition' in document)) {
      applyTheme(next)
      setTheme(next)
      onReady?.()
      return
    }

    // Distance to the farthest corner: the circle must cover the whole screen.
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const transition = document.startViewTransition(() => {
      applyTheme(next)
      // The browser takes the "new" snapshot right after this callback, so React has to
      // finish rendering synchronously here; that's what flushSync does.
      flushSync(() => setTheme(next))
    })

    await transition.ready
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 850, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
    )
    onReady?.()
    await transition.finished
  }

  return { theme, switchTheme }
}
