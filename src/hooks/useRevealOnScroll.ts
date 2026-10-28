import { useEffect } from 'react'
import { prefersReducedMotion } from '../motion'

// Elements marked with `data-reveal` start hidden (see index.css) and get `is-visible`
// the first time they enter the viewport. One observer handles the whole page.
// We touch classList directly instead of React state so scrolling never causes a re-render.
export function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-reveal]')

    if (prefersReducedMotion()) {
      elements.forEach((el) => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // reveal once, never hide again
        }
      },
      // Waits until the element is a little inside the screen, not just touching the bottom edge.
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}
