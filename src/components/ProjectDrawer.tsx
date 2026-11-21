import { useCallback, useEffect, useRef, useState } from 'react'
import { featuredProjects } from '../content/projects'
import type { FeaturedProject, ProjectMedia } from '../content/types'
import { diagrams } from '../diagrams'
import { screen } from '../lib/screens'
import { slugFromHash } from '../lib/project-hash'
import { Icon } from './Icon'
import styles from './ProjectDrawer.module.css'

const order = featuredProjects.map((p) => p.slug)
const valid = (slug: string | null) => (slug && order.includes(slug) ? slug : null)

/** Pictures for the gallery: the repo figure used as the architecture diagram is shown there, not twice. */
function galleryOf(p: FeaturedProject): ProjectMedia[] {
  const diagramFile = p.diagram.type === 'repo-figure' ? p.media.find((m) => m.kind === 'repo-figure' && m.view === 'architecture')?.src : undefined
  return p.media.filter((m) => m.src && m.src !== diagramFile)
}

function Picture({ m, large }: { m: ProjectMedia; large?: boolean }) {
  const s = m.src ? screen(m.src) : undefined
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
  const current = shots[Math.min(main, shots.length - 1)]
  return (
    <div className={styles.gallery}>
      <figure className={styles.sheet} data-kind="product">
        <Picture m={current} large />
      </figure>
      {shots.length > 1 && (
        <ul className={styles.thumbs} aria-label="More screens">
          {shots.slice(0, 3).map((m, i) =>
            i === main ? null : (
              <li key={m.view}>
                <button type="button" className={styles.thumb} onClick={() => setMain(i)} aria-label={`Show larger: ${m.description}`}>
                  <Picture m={m} />
                </button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}

function Architecture({ project }: { project: FeaturedProject }) {
  if (project.diagram.type === 'repo-figure') {
    const fig = project.media.find((m) => m.kind === 'repo-figure' && m.view === 'architecture')
    return fig ? (
      <figure className={styles.sheet}>
        <Picture m={fig} />
        <figcaption className={styles.caption}>From the repository, {project.diagram.repoPath}</figcaption>
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
  const opener = useRef<Element | null>(null)
  const [slug, setSlug] = useState<string | null>(() => (typeof window === 'undefined' ? null : valid(slugFromHash())))

  // The hash is the source of truth: links, the palette and the back button all just change it.
  useEffect(() => {
    const onHash = () => {
      const next = valid(slugFromHash())
      if (next && !ref.current?.open) opener.current = document.activeElement
      setSlug(next)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (slug && !d.open) d.showModal()
    if (!slug && d.open) d.close()
    scroller.current?.scrollTo({ top: 0 })
  }, [slug])

  const onClose = useCallback(() => {
    if (slugFromHash()) history.replaceState(null, '', '#projects')
    const back = opener.current
    setSlug(null)
    opener.current = null
    const target = back instanceof HTMLElement && document.contains(back) ? back : document.getElementById('projects-head')
    requestAnimationFrame(() => target?.focus?.({ preventScroll: true }))
  }, [])

  const go = useCallback(
    (step: 1 | -1) => {
      if (!slug) return
      const next = order[(order.indexOf(slug) + step + order.length) % order.length]
      history.replaceState(null, '', `#project-${next}`)
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
        <div className={styles.inner} ref={scroller} key={p.slug}>
          <header className={styles.bar}>
            <p className={styles.count}>
              <span className="mono">
                {i + 1} of {order.length}
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

          <div className={styles.head}>
            <h2 id="drawer-title">{p.name}</h2>
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

          {p.figures.length > 0 && (
            <section className={styles.block} aria-labelledby="d-figures">
              <h3 id="d-figures">Figures</h3>
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

          <footer className={styles.links}>
            {p.links.code ? (
              <a className="btn btn--card" href={p.links.code} target="_blank" rel="noopener noreferrer">
                <Icon name="github" />
                Code on GitHub
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
            <p className={styles.keys}>
              <kbd>←</kbd> <kbd>→</kbd> to move between projects, <kbd>Esc</kbd> to close
            </p>
          </footer>
        </div>
      )}
    </dialog>
  )
}
