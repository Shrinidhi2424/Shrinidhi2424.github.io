import { useCallback, useEffect, useRef, useState } from 'react'
import { Command } from 'cmdk'
import { featuredProjects, moreProjects } from '../content/projects'
import { profile } from '../content/profile'
import { toggleTheme, useTheme } from '../hooks/useTheme'
import { openProject } from '../lib/project-hash'
import { copyText, showToast } from '../lib/toast'
import { Icon } from './Icon'
import styles from './CommandPalette.module.css'

const sections = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'about', label: 'About' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

/**
 * Ranking: a word of the visible label that equals the query wins, then a keyword that equals it, then
 * prefixes, then any containment. So "resume" opens the résumé, "email" copies the address and "theme"
 * switches the theme, rather than whichever project lists a matching tag.
 */
function rank(value: string, search: string, keywords: string[] = []) {
  const q = fold(search)
  if (!q) return 1
  const label = fold(value)
  const words = label.split(/[^a-z0-9.+#]+/).filter(Boolean)
  const keys = keywords.map(fold)
  if (label === q || label.startsWith(q + ' ')) return 1
  if (words.includes(q)) return 0.98
  if (keys.includes(q)) return 0.95
  if (label.startsWith(q)) return 0.9
  if (words.some((w) => w.startsWith(q))) return 0.85
  if (keys.some((k) => k.startsWith(q))) return 0.7
  if (label.includes(q) || keys.some((k) => k.includes(q))) return 0.4
  return 0
}

/** Ctrl K / ⌘ K, "/" or the nav's command field: search the page and run an action. */
export function CommandPalette() {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  // Mounted on first open and kept, so the list is still there while the palette fades out.
  const [mounted, setMounted] = useState(false)
  if (open && !mounted) setMounted(true)
  // Each opening starts fresh (empty field, first row selected); closing keeps what was there.
  const [session, setSession] = useState(0)
  const { theme } = useTheme()

  const show = useCallback(() => {
    // The case drawer is its own modal; the palette waits until it closes.
    if (document.querySelector('dialog[open]:not([data-palette])')) return
    setSearch('')
    setSession((n) => n + 1)
    setOpen(true)
  }, [])
  const hide = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      d.querySelector<HTMLInputElement>('input')?.focus()
    }
    if (!open && d.open) d.close()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) hide()
        else show()
      } else if (e.key === '/' && !open && !typing(e.target)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', show)
    }
  }, [open, show, hide])

  // Close first, then act, so focus and scrolling land on the page.
  const run = (action: () => void) => {
    hide()
    requestAnimationFrame(action)
  }

  const goTo = (id: string) =>
    run(() => {
      const el = document.getElementById(id)
      el?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
      history.replaceState(null, '', `#${id}`)
      // Move focus with the reader: the section's heading, or the section itself.
      const target = el?.querySelector<HTMLElement>('h2, h3') ?? el
      if (target) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
    })

  const external = (href: string) => run(() => window.open(href, '_blank', 'noopener,noreferrer'))

  const copyEmail = () =>
    run(async () => {
      try {
        await copyText(profile.email)
        showToast('Email address copied')
      } catch {
        showToast('Copying was blocked. The address is in the Contact section.')
      }
    })

  // A click on the backdrop closes it.
  const onClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target !== ref.current) return
    const r = ref.current.getBoundingClientRect()
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) hide()
  }

  const themeLabel = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`

  return (
    <dialog ref={ref} className={styles.palette} data-palette aria-label="Command palette" onClose={hide} onClick={onClick}>
      {mounted && (
        <Command key={session} label="Search projects, résumé, email" className={styles.command} loop filter={rank}>
          <div className={styles.inputRow}>
            <Icon name="search" />
            <Command.Input value={search} onValueChange={setSearch} placeholder="Projects, résumé, email" className={styles.input} />
            <kbd className={styles.esc} aria-hidden="true">
              Esc
            </kbd>
            <button type="button" className={styles.cancel} onClick={hide}>
              Cancel
            </button>
          </div>
          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>Nothing matches that. Try a project name, “résumé” or “email”.</Command.Empty>

            <Command.Group heading="Get in touch" className={styles.group}>
              <Command.Item value="Download résumé" keywords={['resume', 'cv', 'pdf']} onSelect={() => external(profile.resume.href)} className={styles.item}>
                <Icon name="file" />
                Download résumé
                <span className={styles.hint}>PDF, new tab</span>
              </Command.Item>
              <Command.Item value="Copy email" keywords={['email', 'mail', 'contact', 'address']} onSelect={copyEmail} className={styles.item}>
                <Icon name="copy" />
                Copy email
                <span className={`mono ${styles.hint}`}>{profile.email}</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Case studies" className={styles.group}>
              {featuredProjects.map((p) => (
                <Command.Item key={p.slug} value={p.name} keywords={[...p.tags, 'project', 'case study']} onSelect={() => run(() => openProject(p.slug))} className={styles.item}>
                  <span>{p.name}</span>
                  <span className={`mono ${styles.hint}`}>{p.year}</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="More on GitHub" className={styles.group}>
              {moreProjects.map((p) => (
                <Command.Item key={p.name} value={p.name} keywords={[...p.tags, 'github', 'code']} onSelect={() => external(p.repo)} className={styles.item}>
                  <span>{p.name}</span>
                  <span className={styles.hint}>
                    Opens GitHub <Icon name="external" size={16} />
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Go to" className={styles.group}>
              {sections.map((s) => (
                <Command.Item key={s.id} value={s.label} keywords={['go to', 'section']} onSelect={() => goTo(s.id)} className={styles.item}>
                  {s.label}
                  <span className={styles.hint}>Section</span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Other" className={styles.group}>
              <Command.Item value={themeLabel} keywords={['theme', 'dark', 'light', 'mode', 'toggle']} onSelect={() => run(() => toggleTheme())} className={styles.item}>
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                {themeLabel}
              </Command.Item>
              <Command.Item value="Open GitHub" keywords={['github', 'code', 'repositories']} onSelect={() => external(profile.links.github)} className={styles.item}>
                <Icon name="github" />
                Open GitHub
                <span className={styles.hint}>New tab</span>
              </Command.Item>
              <Command.Item value="Open LinkedIn" keywords={['linkedin', 'profile']} onSelect={() => external(profile.links.linkedin)} className={styles.item}>
                <Icon name="linkedin" />
                Open LinkedIn
                <span className={styles.hint}>New tab</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      )}
    </dialog>
  )
}
