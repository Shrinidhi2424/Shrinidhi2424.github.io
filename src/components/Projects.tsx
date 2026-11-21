import { featuredProjects } from '../content/projects'
import type { FeaturedProject } from '../content/types'
import { profile } from '../content/profile'
import { sectionHeads } from '../content/sections'
import { screen } from '../lib/screens'
import { useActiveSection } from '../hooks/useActiveSection'
import { Icon } from './Icon'
import styles from './Projects.module.css'

const panelId = (slug: string) => `work-${slug}`
const ids = featuredProjects.map((p) => panelId(p.slug))

/** The lead picture of a project: its first capture, two phone screens side by side, or its code block. */
function Lead({ project }: { project: FeaturedProject }) {
  const code = project.media.find((m) => m.code)
  if (code?.code) {
    return (
      <figure className={styles.code} data-kind="product">
        <pre tabIndex={0} aria-label={code.description}>
          <code>{code.code.text}</code>
        </pre>
      </figure>
    )
  }

  const shots = project.media.filter((m) => m.src)
  const phones = shots.filter((m) => {
    const s = m.src ? screen(m.src) : undefined
    // phone screenshots are the narrow ones (SafeXplore, shot on a phone)
    return s && s.width < 800 && s.height > s.width * 1.6
  })

  if (phones.length >= 2) {
    return (
      <figure className={`${styles.media} ${styles.phones}`} data-kind="product">
        {phones.slice(0, 2).map((m) => {
          const s = screen(m.src!)!
          return <img key={m.view} src={s.src} width={s.width} height={s.height} alt={m.alt ?? ''} loading="lazy" decoding="async" />
        })}
      </figure>
    )
  }

  const lead = shots[0]
  const file = lead?.crop ?? lead?.src
  const s = file ? screen(file) : undefined
  if (!lead || !s) return null
  return (
    <figure className={styles.media} data-slot={`work-${project.slug}`} data-kind="product" data-alt={lead.alt}>
      <img src={s.src} width={s.width} height={s.height} alt={lead.alt ?? ''} loading="lazy" decoding="async" />
    </figure>
  )
}

export function Projects() {
  const active = useActiveSection(ids)

  return (
    <section className={styles.section} id="projects" aria-labelledby="projects-head">
      <div className={`container ${styles.grid}`}>
        <div className={styles.pane}>
          <h2 id="projects-head" tabIndex={-1}>{sectionHeads.projects}</h2>
          <ol className={styles.index} aria-label="Featured projects">
            {featuredProjects.map((p) => (
              <li key={p.slug}>
                <a href={`#${panelId(p.slug)}`} aria-current={active === panelId(p.slug) ? 'true' : undefined}>
                  <span className={styles.indexName}>{p.name}</span>
                  <span className={styles.indexScope}>{p.scope}</span>
                </a>
              </li>
            ))}
          </ol>
          <a className={styles.all} href={profile.links.github} target="_blank" rel="noopener noreferrer">
            <Icon name="github" />
            Every repository on GitHub
          </a>
        </div>

        <div className={styles.panels}>
          {featuredProjects.map((p) => (
            <article key={p.slug} id={panelId(p.slug)} className={styles.panel} aria-labelledby={`${panelId(p.slug)}-name`}>
              <a className={styles.leadLink} href={`#project-${p.slug}`} tabIndex={-1} aria-hidden="true">
                <Lead project={p} />
              </a>
              <div className={styles.text}>
                <div className={styles.titleRow}>
                  <h3 id={`${panelId(p.slug)}-name`}>{p.name}</h3>
                  <p className={styles.meta}>
                    <span className="mono">{p.year}</span>
                    {p.team && <span>Team project</span>}
                    {p.status && <span>In progress</span>}
                  </p>
                </div>
                <p className={styles.oneLiner}>{p.oneLiner}</p>
                {p.figures[0] && (
                  <p className={styles.figure}>
                    <span className="mono">{p.figures[0].value}</span> {p.figures[0].label}
                    {p.figures[0].context && <span className={styles.figureContext}> ({p.figures[0].context})</span>}
                  </p>
                )}
                {p.disclaimer && <p className={styles.disclaimer}>{p.disclaimer}</p>}
                <ul className={styles.techList} aria-label={`${p.name} stack`}>
                  {p.tags.map((t) => (
                    <li key={t} className={`mono ${styles.tech}`}>
                      {t}
                    </li>
                  ))}
                </ul>
                <a className={styles.open} href={`#project-${p.slug}`}>
                  Open the case study<span className="visually-hidden">: {p.name}</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
