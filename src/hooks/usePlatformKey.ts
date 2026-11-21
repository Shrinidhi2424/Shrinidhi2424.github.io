import { useState } from 'react'

function detect() {
  if (typeof navigator === 'undefined') return 'Ctrl K'
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } }
  const platform = nav.userAgentData?.platform ?? navigator.platform ?? ''
  return /mac|iphone|ipad/i.test(platform) ? '⌘ K' : 'Ctrl K'
}

/** "Ctrl K" on Windows and Linux, "⌘ K" on macOS (non-breaking space inside the key pair). */
export function usePlatformKey() {
  const [label] = useState(detect)
  return label
}
