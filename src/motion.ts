// Visitors who ask the OS for less motion get the final state right away, with no animation.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
