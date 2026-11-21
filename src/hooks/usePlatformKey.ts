import { useSyncExternalStore } from 'react'

function detect() {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? ''
  return /mac|iphone|ipad/i.test(platform) ? '⌘ K' : 'Ctrl K'
}

/** "Ctrl K" on Windows and Linux, "⌘ K" on macOS (non-breaking space inside the key pair). */
const never = () => () => {}

export function usePlatformKey() {
  // "Ctrl K" in the prerendered page, then the visitor's own platform once hydrated.
  return useSyncExternalStore(never, detect, () => 'Ctrl K')
}
