import { useEffect, type RefObject } from 'react'
import { prefersReducedMotion } from '../motion'

// About 30 updates per second: smooth enough for fire, and half the work of every frame.
const FRAME_MS = 33

/**
 * Drives two CSS variables on `ref` while `active` is true:
 * - `--flicker` (0 to 1): how strong the fire is right now;
 * - `--sway` (-1 to 1): which way the flame leans.
 *
 * The flame and the light on the page both read these same variables, which is what keeps
 * them in sync: when the flame jumps, the light jumps with it.
 *
 * Real fire isn't a loop, so instead of a CSS keyframe animation (which repeats) we pick a new
 * random target every so often and ease towards it. Fast, small changes for the flicker,
 * slower ones for the sway.
 */
export function useFlicker(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const set = (flicker: number, sway: number) => {
      el.style.setProperty('--flicker', flicker.toFixed(3))
      el.style.setProperty('--sway', sway.toFixed(3))
    }

    if (!active || prefersReducedMotion()) {
      set(0.6, 0) // a calm, steady flame
      return
    }

    let flicker = 0.6
    let sway = 0
    let flickerTarget = flicker
    let swayTarget = sway
    let nextFlickerAt = 0
    let nextSwayAt = 0
    let lastUpdate = 0
    let frame = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - lastUpdate < FRAME_MS) return
      lastUpdate = now

      if (now >= nextFlickerAt) {
        flickerTarget = 0.25 + Math.random() * 0.75
        nextFlickerAt = now + 60 + Math.random() * 140
      }
      if (now >= nextSwayAt) {
        swayTarget = Math.random() * 2 - 1
        nextSwayAt = now + 250 + Math.random() * 650
      }
      // Moving a fraction of the way each update smooths the jumps into motion.
      flicker += (flickerTarget - flicker) * 0.35
      sway += (swayTarget - sway) * 0.1
      set(flicker, sway)
    }

    // requestAnimationFrame pauses by itself when the tab is in the background.
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [ref, active])
}
