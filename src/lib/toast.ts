/** A tiny toast channel: the palette's "Copy email" (an effect the visitor cannot see) reports through it. */
export const showToast = (message: string) => window.dispatchEvent(new CustomEvent('toast:show', { detail: message }))

export async function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.append(area)
  area.select()
  const ok = document.execCommand('copy')
  area.remove()
  if (!ok) throw new Error('copy failed')
}
