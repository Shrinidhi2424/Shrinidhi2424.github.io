import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from 'react'
import { PREFIX } from '../lib/project-hash'

// The drawer (with its diagrams) and the palette (with cmdk) stay out of the first script: nobody sees them
// until they act, so the page hydrates with less work. Their code is fetched when the browser is idle, but
// they only render when the visitor asks (a #project- link, Ctrl/⌘ K, "/" or the nav field), so no render
// work lands while the page is still settling, and the first open does not wait on the network.
const drawerModule = () => import('./ProjectDrawer')
const paletteModule = () => import('./CommandPalette')
const ProjectDrawer = lazy(() => drawerModule().then((m) => ({ default: m.ProjectDrawer })))
const CommandPalette = lazy(() => paletteModule().then((m) => ({ default: m.CommandPalette })))

function whenIdle(cb: () => void) {
  if (typeof window.requestIdleCallback === 'function') {
    const id = window.requestIdleCallback(cb, { timeout: 2500 })
    return () => window.cancelIdleCallback(id)
  }
  const id = window.setTimeout(cb, 1200)
  return () => window.clearTimeout(id)
}

const typing = (t: EventTarget | null) => t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
const wantsProject = () => window.location.hash.startsWith(`#${PREFIX}`)
const onHash = (cb: () => void) => {
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

/** The case drawer: rendered for a #project- link (on arrival or later). It reads the hash itself. */
export function DeferredDrawer() {
  // false in the prerendered page and during hydration, then the real hash.
  const asked = useSyncExternalStore(onHash, wantsProject, () => false)
  useEffect(() => whenIdle(() => void drawerModule()), [])
  // Once rendered it stays: closing sets #projects, and the drawer must stay mounted to slide away.
  const [loaded, setLoaded] = useState(false)
  if (asked && !loaded) setLoaded(true)
  return loaded || asked ? (
    <Suspense fallback={null}>
      <ProjectDrawer />
    </Suspense>
  ) : null
}

/** The command palette: rendered on Ctrl/⌘ K, "/" or the nav field, and opens as soon as its code is in. */
export function DeferredPalette() {
  const [load, setLoad] = useState(false)
  const [openOnMount, setOpenOnMount] = useState(false)
  useEffect(() => {
    // Listens until the palette itself is in the page (its chunk may still be loading after `load`).
    const ready = () => !!document.querySelector('dialog[data-palette]')
    const ask = () => {
      // The case drawer is its own modal; the palette waits until it closes (as CommandPalette does).
      if (ready() || document.querySelector('dialog[open]')) return
      setOpenOnMount(true)
      setLoad(true)
    }
    const onKey = (e: KeyboardEvent) => {
      if (ready()) return
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !typing(e.target))) {
        e.preventDefault()
        ask()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette:open', ask)
    const cancel = whenIdle(() => void paletteModule())
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette:open', ask)
      cancel()
    }
  }, [])
  return load ? (
    <Suspense fallback={null}>
      <CommandPalette openOnMount={openOnMount} />
    </Suspense>
  ) : null
}
