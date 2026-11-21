import { useSyncExternalStore } from 'react'

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

export function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* storage blocked: the choice lasts for this visit */
  }
  listeners.forEach((l) => l())
}

export function toggleTheme() {
  setTheme(current() === 'dark' ? 'light' : 'dark')
}

/** One shared theme for the nav toggle and the command palette. Follows the system until the visitor picks. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, current, () => 'light' as Theme)
  return { theme, toggle: toggleTheme }
}
