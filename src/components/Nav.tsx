import { useEffect, useId, useState } from 'react'
import { profile } from '../content/profile'
import { useTheme } from '../hooks/useTheme'
import { usePlatformKey } from '../hooks/usePlatformKey'
import { Icon } from './Icon'
import { openPalette } from '../lib/palette'
import styles from './Nav.module.css'

const links = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

export function Nav() {
  const { theme, toggle } = useTheme()
  const keyLabel = usePlatformKey()
  const [open, setOpen] = useState(false)
  const menuId = useId()
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
              <a href={l.href} onClick={() => setOpen(false)}>
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
          <button type="button" className="icon-btn" onClick={toggle} aria-label={`Switch to ${target} mode`}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
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
