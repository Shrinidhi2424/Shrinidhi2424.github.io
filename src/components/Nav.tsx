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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={styles.bar}>
      <nav className={`container ${styles.inner}`} aria-label="Main">
        <a className={styles.wordmark} href="#top" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>

        <button type="button" className={styles.search} onClick={openPalette} aria-label="Search projects, résumé and contact">
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
              Résumé
            </a>
          </li>
        </ul>

        <div className={styles.actions}>
          <a className={`btn btn--card ${styles.resume}`} href={profile.resume.href} target="_blank" rel="noopener noreferrer">
            Résumé
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
