import { profile } from '../content/profile'
import styles from './Footer.module.css'

const pageLinks = [
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#contact', label: 'Contact' },
]

const year = new Date().getFullYear()

// footer: mast. The wordmark set large over the page's real links.
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <a className={styles.mast} href="#top" aria-label={`${profile.name}, back to top`}>
          {profile.name}
        </a>
        <div className={styles.row}>
          <nav aria-label="Footer">
            <ul className={styles.links}>
              {pageLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
              <li>
                <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
            </ul>
          </nav>
          <p className={styles.legal}>
            <span>
              &copy; {year} {profile.name}
            </span>
            <span>
              Built with React and Vite.{' '}
              <a href={profile.links.source} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
