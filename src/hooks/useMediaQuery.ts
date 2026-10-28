import { useSyncExternalStore } from 'react'

/**
 * True while the CSS media query matches, and re-renders when that changes (e.g. resizing the
 * window across 1100px). useSyncExternalStore is React's tool for reading a value that lives
 * outside React (here, the browser's matchMedia) and subscribing to its changes.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const media = matchMedia(query)
      media.addEventListener('change', onChange)
      return () => media.removeEventListener('change', onChange)
    },
    () => matchMedia(query).matches,
  )
}
