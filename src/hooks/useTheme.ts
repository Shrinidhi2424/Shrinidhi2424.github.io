import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'theme'
const media = () => window.matchMedia('(prefers-color-scheme: dark)')

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(KEY)
    return t === 'light' || t === 'dark' ? t : null
  } catch {
    return null
  }
}

function resolve(): Theme {
  return readStored() ?? (media().matches ? 'dark' : 'light')
}

/** The effective theme. Follows the system until the visitor picks one; the pick is remembered. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (typeof window === 'undefined' ? 'light' : resolve()))

  useEffect(() => {
    const mq = media()
    const onChange = () => {
      if (!readStored()) setTheme(mq.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      document.documentElement.dataset.theme = next
      try {
        localStorage.setItem(KEY, next)
      } catch {
        /* storage blocked: the choice lasts for this visit */
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
