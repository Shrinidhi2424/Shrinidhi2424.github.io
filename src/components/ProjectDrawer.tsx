import { useCallback, useEffect, useRef, useState } from 'react'
import { featuredProjects } from '../content/projects'
import { profile } from '../content/profile'
import type { FeaturedProject, ProjectMedia } from '../content/types'
import { diagrams } from '../diagrams'
import { screen } from '../lib/screens'
import { PREFIX, slugFromHash } from '../lib/project-hash'
import { showToast } from '../lib/toast'
import { Icon } from './Icon'
import styles from './ProjectDrawer.module.css'

const order = featuredProjects.map((p) => p.slug)
const valid = (slug: string | null) => (slug && order.includes(slug) ? slug : null)

/** Pictures for the gallery: the repo figure used as the architecture diagram is shown there, not twice. */
function galleryOf(p: FeaturedProject): ProjectMedia[] {
  const diagramFile = p.diagram.type === 'repo-figure' ? p.media.find((m) => m.kind === 'repo-figure' && m.view === 'architecture')?.src : undefined
  return p.media.filter((m) => m.src && m.src !== diagramFile)
}

function Picture({ m, large, useCrop }: { m: ProjectMedia; large?: boolean; useCrop?: boolean }) {
  const file = (useCrop && m.crop) || m.src
  const s = file ? screen(file) : undefined
  if (!s) return null
  return <img src={s.src} width={s.width} height={s.height} alt={m.alt ?? ''} loading={large ? 'eager' : 'lazy'} decoding="async" />
}

function Gallery({ project }: { project: FeaturedProject }) {
  const code = project.media.find((m) => m.code)
  const shots = galleryOf(project)
  const phones = shots.filter((m) => {
    const s = m.src ? screen(m.src) : undefined
    return s && s.width < 800
  })
  const [main, setMain] = useState(0)

  if (code?.code && !shots.length) {
    return (
      <figure className={styles.code} data-kind="product">
        <pre tabIndex={0} aria-label={code.description}>
          <code>{code.code.text}</code>
        </pre>
      </figure>
    )
  }
  if (phones.length >= 2) {
    return (
      <figure className={`${styles.sheet} ${styles.phones}`} data-kind="product">
        {phones.slice(0, 2).map((m) => (
          <Picture key={m.view} m={m} large />
        ))}
      </figure>
    )
  }
  if (!shots.length) return null
  const list = shots.slice(0, 3)
  const current = list[Math.min(main, list.length - 1)]
  const full = current.src ? screen(current.src) : undefined
  return (
    <div className={styles.gallery}>
      <figure className={styles.sheet} data-kind="product">
        <Picture m={current} large useCrop />
      </figure>
      <div className={styles.galleryBar}>
        {list.length > 1 && (
          <ul className={styles.thumbs} aria-label="Screens">
            {list.map((m, i) => (
              <li key={m.view}>
                <button type="button" className={styles.thumb} onClick={() => setMain(i)} aria-pressed={i === main} aria-label={`Show ${m.description}`}>
                  <Picture m={m} />
                </button>
              </li>
            ))}
          </ul>
        )}
        {full && current.crop && (
          <a className={styles.fullLink} href={full.src} target="_blank" rel="noopener noreferrer">
            Full screen capture<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        )}
      </div>
    </div>
  )
}

function Architecture({ project }: { project: FeaturedProject }) {
  if (project.diagram.type === 'repo-figure') {
    const fig = project.media.find((m) => m.kind === 'repo-figure' && m.view === 'architecture')
    const s = fig?.src ? screen(fig.src) : undefined
    return fig && s ? (
      <figure className={styles.sheet}>
        <a className={styles.figureLink} href={s.src} target="_blank" rel="noopener noreferrer">
          <Picture m={fig} />
          <span className="visually-hidden"> (open full size in a new tab)</span>
        </a>
        <figcaption className={styles.caption}>From the repository, {project.diagram.repoPath}. Select it to open full size.</figcaption>
      </figure>
    ) : null
  }
  const Diagram = diagrams[project.slug]
  return Diagram ? (
    <div className={styles.diagram}>
      <Diagram />
    </div>
  ) : null
}

/** The case drawer: a native modal dialog, opened by #project-<slug>, with previous and next. */
export function ProjectDrawer() {
  const ref = useRef<HTMLDialogElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const opener = useRef<Element | null>(null)
  const shown = useRef<string | null>(null)
  const [slug, setSlug] = useState<string | null>(() => (typeof window === 'undefined' ? null : valid(slugFromHash())))

  // The hash is the source of truth: links, the palette and the back button all just change it.
  useEffect(() => {
    const check = () => {
      const raw = slugFromHash()
      const next = valid(raw)
      if (raw && !next) {
        history.replaceState(null, '', '#projects')
        showToast('That project link is out of date. The projects are listed below.')
        return
      }
      if (next && !ref.current?.open) opener.current = document.activeElement
      setSlug(next)
    }
    if (window.location.hash.startsWith(`#${PREFIX}`) && !valid(slugFromHash())) check()
    window.addEventListener('hashchange', check)
    return () => window.removeEventListener('hashchange', check)
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (slug && !d.open) d.showModal()
    if (!slug && d.open) d.close()
    // Moving between projects keeps focus inside the drawer: the new heading takes it and is announced.
    if (slug && shown.current && shown.current !== slug) {
      scroller.current?.scrollTo({ top: 0 })
      title.current?.focus({ preventScroll: true })
    }
    shown.current = slug
  }, [slug])

  const onClose = useCallback(() => {
    const last = shown.current
    if (slugFromHash()) history.replaceState(null, '', '#projects')
    const back = opener.current
    setSlug(null)
    opener.current = null
    // Return to what opened the drawer when it still shows the project last viewed; otherwise to that project's own link.
    const openerFits = back instanceof HTMLElement && document.contains(back) && back.getAttribute('aria-hidden') !== 'true' && (!last || back.getAttribute('href') === `#${PREFIX}${last}` || !back.getAttribute('href')?.startsWith(`#${PREFIX}`))
    const target = openerFits ? (back as HTMLElement) : (document.querySelector<HTMLElement>(`#work-${last} a[href="#${PREFIX}${last}"]:not([aria-hidden])`) ?? document.getElementById('projects-head'))
    requestAnimationFrame(() => target?.focus?.({ preventScroll: !(target && !openerFits) }))
  }, [])

  const go = useCallback(
    (step: 1 | -1) => {
      if (!slug) return
      const next = order[(order.indexOf(slug) + step + order.length) % order.length]
      history.replaceState(null, '', `#${PREFIX}${next}`)
      setSlug(next)
    },
    [slug],
  )

  const onKeyDown = (e: React.KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (t.closest('pre, input, textarea, [contenteditable="true"]')) return
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    }
  }

  // A click on the backdrop (outside the panel) closes it.
  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target !== ref.current) return
    const r = ref.current.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) ref.current.close()
  }

  const p = featuredProjects.find((x) => x.slug === slug)
  const i = p ? order.indexOf(p.slug) : -1
  const prev = i >= 0 ? featuredProjects[(i - 1 + order.length) % order.length] : undefined
  const next = i >= 0 ? featuredProjects[(i + 1) % order.length] : undefined

  return (
    <dialog ref={ref} className={styles.drawer} aria-labelledby="drawer-title" onClose={onClose} onKeyDown={onKeyDown} onClick={onClick}>
      {p && (
        <div className={styles.inner} ref={scroller}>
          <header className={styles.bar}>
            <p className={styles.count}>
              <span className="mono">
                {i + 1} of {order.length}
              </span>
              <span className={styles.keys} aria-hidden="true">
                <kbd>←</kbd> <kbd>→</kbd> to browse
              </span>
            </p>
            <div className={styles.barActions}>
              <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={`Previous project: ${prev?.name}`}>
                <Icon name="chevronLeft" />
              </button>
              <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={`Next project: ${next?.name}`}>
                <Icon name="chevronRight" />
              </button>
              <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label="Close project">
                <Icon name="x" />
              </button>
            </div>
          </header>

          <div className={styles.body} key={p.slug}>
            <div className={styles.head}>
              <h2 id="drawer-title" ref={title} tabIndex={-1}>
                {p.name}
              </h2>
              <p className={styles.oneLiner}>{p.oneLiner}</p>
              <dl className={styles.facts}>
                <div>
                  <dt>Role</dt>
                  <dd>{p.role}</dd>
                </div>
                <div>
                  <dt>Year</dt>
                  <dd className="mono">{p.year}</dd>
                </div>
                {p.status && (
                  <div>
                    <dt>Status</dt>
                    <dd>In progress</dd>
                  </div>
                )}
              </dl>
              {p.context && <p className={styles.note}>{p.context}</p>}
              {p.disclaimer && <p className={styles.note}>{p.disclaimer}</p>}
            </div>

            {p.figures.length > 0 && (
              <section className={styles.figuresBlock} aria-labelledby="d-figures">
                <h3 id="d-figures" className="visually-hidden">
                  Figures
                </h3>
                <dl className={styles.figures}>
                  {p.figures.map((f) => (
                    <div key={f.label}>
                      <dt className="mono">{f.value}</dt>
                      <dd>
                        {f.label}
                        {f.context && <span className={styles.context}> ({f.context})</span>}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <Gallery project={p} />

            <section className={styles.block} aria-labelledby="d-problem">
              <h3 id="d-problem">Problem</h3>
              <p>{p.problem}</p>
            </section>

            <section className={styles.block} aria-labelledby="d-built">
              <h3 id="d-built">What I built</h3>
              <ul className={styles.built}>
                {p.built.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>

            <section className={styles.block} aria-labelledby="d-arch">
              <h3 id="d-arch">Architecture</h3>
              <Architecture project={p} />
            </section>

            <section className={styles.block} aria-labelledby="d-stack">
              <h3 id="d-stack">Stack</h3>
              <ul className={styles.stack}>
                {p.stack.map((s) => (
                  <li key={s} className="mono">
                    {s}
                  </li>
                ))}
              </ul>
            </section>

            <footer className={styles.links}>
              <div className={styles.linkRow}>
                {p.links.code ? (
                  <a className="btn btn--card" href={p.links.code} target="_blank" rel="noopener noreferrer">
                    <Icon name="github" />
                    Code on GitHub<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                ) : (
                  p.codeNote && <p className={styles.note}>{p.codeNote}</p>
                )}
                {p.links.demo && (
                  <a className="btn btn--card" href={p.links.demo} target="_blank" rel="noopener noreferrer">
                    <Icon name="external" />
                    Live demo
                  </a>
                )}
              </div>
              <div className={styles.reach}>
                <a href={profile.resume.href} target="_blank" rel="noopener noreferrer">
                  <Icon name="file" />
                  Résumé<span className="visually-hidden"> (PDF, opens in a new tab)</span>
                </a>
                <a href={`mailto:${profile.email}`}>
                  <Icon name="mail" />
                  {profile.email}
                </a>
              </div>
              {next && (
                <button type="button" className={styles.next} onClick={() => go(1)}>
                  <span className={styles.nextLabel}>Next project</span>
                  <span className={styles.nextName}>{next.name}</span>
                  <Icon name="chevronRight" />
                </button>
              )}
            </footer>
          </div>
        </div>
      )}
    </dialog>
  )
}
