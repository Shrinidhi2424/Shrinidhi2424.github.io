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

/** Ctrl K / ⌘ K, "/" or the nav's command field: search the page and run an action. */
export function CommandPalette() {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { theme } = useTheme()

  const show = useCallback(() => {
    // The case drawer is its own modal; the palette waits until it closes.
    if (document.querySelector('dialog[open]:not([data-palette])')) return
    setSearch('')
    setOpen(true)
  }, [])
  const hide = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      d.querySelector<HTMLInputElement>("input")?.focus()
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

  return (
    <dialog ref={ref} className={styles.palette} data-palette aria-label="Command palette" onClose={hide} onClick={onClick}>
      {open && (
        <Command label="Command palette" className={styles.command} loop>
          <div className={styles.inputRow}>
            <Icon name="search" />
            <Command.Input autoFocus value={search} onValueChange={setSearch} placeholder="Search projects, sections and actions" className={styles.input} />
            <kbd className={styles.esc}>Esc</kbd>
          </div>
          <Command.List className={styles.list}>
            <Command.Empty className={styles.empty}>Nothing matches that. Try a project name, “résumé” or “email”.</Command.Empty>

            <Command.Group heading="Go to" className={styles.group}>
              {sections.map((s) => (
                <Command.Item key={s.id} value={`Go to ${s.label}`} onSelect={() => goTo(s.id)} className={styles.item}>
                  {s.label}
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Projects" className={styles.group}>
              {featuredProjects.map((p) => (
                <Command.Item key={p.slug} value={`${p.name} ${p.tags.join(' ')}`} onSelect={() => run(() => openProject(p.slug))} className={styles.item}>
                  <span>{p.name}</span>
                  <span className={styles.hint}>Open case study</span>
                </Command.Item>
              ))}
              {moreProjects.map((p) => (
                <Command.Item key={p.name} value={`${p.name} ${p.tags.join(' ')}`} onSelect={() => external(p.repo)} className={styles.item}>
                  <span>{p.name}</span>
                  <span className={styles.hint}>
                    Code on GitHub <Icon name="external" size={16} />
                  </span>
                </Command.Item>
              ))}
            </Command.Group>

            <Command.Group heading="Actions" className={styles.group}>
              <Command.Item value="Download résumé resume cv pdf" onSelect={() => external(profile.resume.href)} className={styles.item}>
                <Icon name="file" />
                Download résumé
              </Command.Item>
              <Command.Item value="Copy email address contact" onSelect={copyEmail} className={styles.item}>
                <Icon name="copy" />
                Copy email
              </Command.Item>
              <Command.Item value="Toggle theme dark light mode" onSelect={() => run(toggleTheme)} className={styles.item}>
                <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
              </Command.Item>
              <Command.Item value="Open GitHub profile" onSelect={() => external(profile.links.github)} className={styles.item}>
                <Icon name="github" />
                Open GitHub
              </Command.Item>
              <Command.Item value="Open LinkedIn profile" onSelect={() => external(profile.links.linkedin)} className={styles.item}>
                <Icon name="linkedin" />
                Open LinkedIn
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      )}
    </dialog>
  )
}
