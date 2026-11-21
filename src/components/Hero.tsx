import { profile } from '../content/profile'
import { featuredProjects } from '../content/projects'
import resumeai from '../assets/screens/hero-resumeai.webp'
import pulseboard from '../assets/screens/hero-pulseboard.webp'
import phishguard from '../assets/screens/hero-phishguard.webp'
import styles from './Hero.module.css'

type Sheet = { slug: string; src: string; width: number; height: number; alt: string; priority?: boolean }

// Hero crops of the real captures (the part that sells, cut on a section edge), back to front.
const sheets: Sheet[] = [
  {
    slug: 'phishguard',
    src: phishguard,
    width: 1400,
    height: 1448,
    alt: 'PhishGuard flagging an example URL as phishing at 99.6%, with a SHAP chart of the features behind the verdict.',
  },
  {
    slug: 'resumeai-pro',
    src: resumeai,
    width: 1400,
    height: 1428,
    alt: 'ResumeAI Pro analysis of a sample résumé: compatibility 86, ATS 95, keyword coverage 75, and a written summary.',
    priority: true,
  },
  {
    slug: 'pulseboard',
    src: pulseboard,
    width: 1600,
    height: 762,
    alt: 'PulseBoard Kanban board with a card lifted mid-drag over the In Progress column.',
  },
]

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-head">
      <div className={`container ${styles.layout}`}>
        <div className={styles.field}>
          {sheets.map((s) => {
            const name = featuredProjects.find((f) => f.slug === s.slug)?.name ?? s.slug
            return (
              <a key={s.slug} className={styles.sheet} data-sheet={s.slug} href="#projects">
                <figure className={styles.frame} data-slot={`hero-${s.slug}`} data-kind="product" data-alt={s.alt}>
                  <img
                    src={s.src}
                    width={s.width}
                    height={s.height}
                    alt={s.alt}
                    fetchPriority={s.priority ? 'high' : undefined}
                    loading={s.priority ? undefined : 'lazy'}
                    decoding="async"
                  />
                </figure>
                <span className={styles.name}>{name}</span>
              </a>
            )
          })}
        </div>

        <div className={styles.base}>
          <h1 id="hero-head" className={styles.head}>
            {profile.headline}
          </h1>
          <div className={styles.side}>
            <p className={`lead ${styles.lead}`}>{profile.heroSentence}</p>
            <div className={styles.actions}>
              <a className="btn btn--primary" href="#projects">
                View projects
              </a>
              <a className="btn btn--card" href={profile.resume.href} target="_blank" rel="noopener noreferrer">
                Résumé
              </a>
            </div>
            {profile.availability && <p className={styles.availability}>{profile.availability}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
