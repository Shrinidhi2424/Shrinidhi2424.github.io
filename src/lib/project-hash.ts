/** Deep links for the case drawer: #project-<slug>. */
export const PREFIX = 'project-'
export const projectHash = (slug: string) => `#${PREFIX}${slug}`

export function slugFromHash(hash: string = window.location.hash): string | null {
  const h = hash.replace(/^#/, '')
  return h.startsWith(PREFIX) ? decodeURIComponent(h.slice(PREFIX.length)) : null
}

/** Open a project's drawer: setting the hash fires hashchange, which the drawer listens to. */
export function openProject(slug: string) {
  window.location.hash = projectHash(slug)
}
