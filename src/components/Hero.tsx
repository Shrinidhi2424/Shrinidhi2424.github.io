import { profile } from '../content/profile'
import { featuredProjects } from '../content/projects'
import { screen } from '../lib/screens'
import { projectHash } from '../lib/project-hash'
import { copyText, showToast } from '../lib/toast'
import { Icon } from './Icon'
import styles from './Hero.module.css'

type Sheet = { slug: string; file: string; sizes: string; alt: string; priority?: boolean }

// Hero crops of the real captures (the part that sells, cut on a section edge), back to front.
const sheets: Sheet[] = [
  {
    slug: 'phishguard',
    file: 'hero-phishguard.webp',
    // Displayed widths follow Hero.module.css: shares of the field, hidden on phones.
    sizes: '(max-width: 40rem) 1px, (max-width: 60rem) 36vw, min(27vw, 360px)',
    alt: 'PhishGuard flagging an example URL as phishing at 99.6%, with a SHAP chart of the features behind the verdict.',
  },
  {
    slug: 'resumeai-pro',
    file: 'hero-resumeai.webp',
    sizes: '(max-width: 40rem) calc(100vw - 32px), (max-width: 60rem) 56vw, min(40vw, 530px)',
    alt: 'ResumeAI Pro analysis of a sample résumé: compatibility 86, ATS 95, keyword coverage 75, and a written summary.',
    priority: true,
  },
  {
    slug: 'pulseboard',
    file: 'hero-pulseboard.webp',
    sizes: '(max-width: 40rem) 1px, (max-width: 60rem) 48vw, min(39vw, 520px)',
    alt: 'PulseBoard Kanban board with a card lifted mid-drag over the In Progress column.',
  },
]

export function Hero() {
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-head">
      <div className={`container ${styles.layout}`}>
        <div className={styles.field}>
          {sheets.map((s) => {
            const project = featuredProjects.find((f) => f.slug === s.slug)
            const name = project?.name ?? s.slug
            const img = screen(s.file)
            if (!img) return null
            return (
              <a key={s.slug} className={styles.sheet} data-sheet={s.slug} href={projectHash(s.slug)}>
                <figure className={styles.frame} data-slot={`hero-${s.slug}`} data-kind="product" data-alt={s.alt}>
                  <img
                    src={img.src}
                    srcSet={img.srcSet}
                    sizes={s.sizes}
                    width={img.width}
                    height={img.height}
                    alt={s.alt}
                    fetchPriority={s.priority ? 'high' : undefined}
                    loading={s.priority ? undefined : 'lazy'}
                    decoding="async"
                  />
                </figure>
                <span className={styles.caption}>
                  <span className={styles.name}>{name}</span>
                  <span className={styles.line}>{project?.oneLiner}</span>
                  <span className="visually-hidden"> Open the case study.</span>
                </span>
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
                Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span>
              </a>
            </div>
            <p className={styles.email}>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <button
                type="button"
                className="icon-btn"
                aria-label="Copy email address"
                onClick={() =>
                  copyText(profile.email).then(
                    () => showToast('Email address copied'),
                    () => showToast('Copying was blocked. Select the address instead.'),
                  )
                }
              >
                <Icon name="copy" />
              </button>
            </p>
            {profile.availability && <p className={styles.availability}>{profile.availability}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
