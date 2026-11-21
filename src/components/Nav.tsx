import { useEffect, useId, useState } from 'react'
import { profile } from '../content/profile'
import { useTheme } from '../hooks/useTheme'
import { usePlatformKey } from '../hooks/usePlatformKey'
import { useActiveSection } from '../hooks/useActiveSection'
import { Icon } from './Icon'
import { openPalette } from '../lib/palette'
import styles from './Nav.module.css'

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

// The section under the reading line, mapped to the nav link it belongs to (the hero belongs to none).
const watched = ['top', 'projects', 'more-projects', 'about', 'stack', 'experience', 'contact'] as const
const linkFor: Record<string, string | undefined> = { projects: '#projects', 'more-projects': '#projects', about: '#about', stack: '#about', experience: '#experience', contact: '#contact' }

export function Nav() {
  const { theme, toggle } = useTheme()
  const keyLabel = usePlatformKey()
  const [open, setOpen] = useState(false)
  // The icon turns into place only after a press, never on load. Set inside the theme update, so the old icon
  // stays still for the view transition's first snapshot and only the new one turns in.
  const [turned, setTurned] = useState(false)
  const menuId = useId()
  const current = linkFor[useActiveSection(watched)]
  const target = theme === 'dark' ? 'light' : 'dark'

  // The phone menu closes on Esc and on a tap anywhere outside the bar.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!(e.target as Element).closest('header')) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <header className={styles.bar}>
      <nav className={`container ${styles.inner}`} aria-label="Main">
        <a className={styles.wordmark} href="#top" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>

        <button type="button" className={styles.search} onClick={openPalette} aria-label="Search projects, résumé, email">
          <Icon name="search" />
          <span className={styles.searchText}>Search projects, résumé, email</span>
          <kbd className={styles.key}>{keyLabel}</kbd>
        </button>

        <ul className={styles.links} id={menuId} data-open={open || undefined}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} aria-current={current === l.href ? 'true' : undefined} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            </li>
          ))}
          <li className={styles.menuOnly}>
            <a href={profile.resume.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
              Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span>
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <a className={`btn btn--card ${styles.resume}`} href={profile.resume.href} target="_blank" rel="noopener noreferrer">
            Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span>
          </a>
          <button
            type="button"
            className={`icon-btn ${styles.themeBtn}`}
            onClick={() => toggle(() => setTurned(true))}
            aria-label={`Switch to ${target} mode`}
          >
            <span key={theme} className={styles.themeIcon} data-turn={turned || undefined}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </span>
          </button>
          <button
            type="button"
            className={`icon-btn ${styles.menuBtn}`}
            aria-expanded={open}
            aria-controls={menuId}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'x' : 'menu'} />
          </button>
        </div>
      </nav>
    </header>
  )
}
