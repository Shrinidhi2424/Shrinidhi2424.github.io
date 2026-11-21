import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'
const KEY = 'theme'
const listeners = new Set<() => void>()

const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

/** The effective theme: the stored choice, else the system setting (what index.html applied before paint). */
function current(): Theme {
  const set = document.documentElement.dataset.theme
  if (set === 'light' || set === 'dark') return set
  return readStored() ?? (media().matches ? 'dark' : 'light')
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const mq = media()
  mq.addEventListener('change', cb)
  return () => {
    listeners.delete(cb)
    mq.removeEventListener('change', cb)
  }
}

function apply(next: Theme, during?: () => void) {
  const root = document.documentElement
  // Hold every colour transition for this one change, so controls do not trail behind the page.
  root.dataset.themeSwitching = ''
  root.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* storage blocked: the choice lasts for this visit */
  }
  flushSync(() => {
    during?.()
    listeners.forEach((l) => l())
  })
  void document.body.offsetWidth // full style recalc while transitions are held
  delete root.dataset.themeSwitching
}

/**
 * Switch the theme. The page crossfades (220ms) where View Transitions exist; reduced motion switches at once.
 * `during` runs inside the update, after the old page is captured (the nav uses it to turn only the new icon).
 */
export function setTheme(next: Theme, during?: () => void) {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (!reduce && typeof document.startViewTransition === 'function') document.startViewTransition(() => apply(next, during))
  else apply(next, during)
}

export function toggleTheme(during?: () => void) {
  setTheme(current() === 'dark' ? 'light' : 'dark', during)
}

/** One shared theme for the nav toggle and the command palette. Follows the system until the visitor picks. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'light' as Theme)
  return { theme, toggle: toggleTheme }
}
