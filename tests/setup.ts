// jsdom gaps the page relies on: matchMedia, IntersectionObserver, ResizeObserver (cmdk), scrollIntoView and <dialog>.
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
  document.documentElement.removeAttribute('data-theme')
  localStorage.clear()
  history.replaceState(null, '', '/')
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent: () => false,
  }),
})

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
Object.assign(window, { IntersectionObserver: NoopObserver, ResizeObserver: NoopObserver })
Element.prototype.scrollIntoView = function () {}
Element.prototype.scrollTo = function () {} as typeof Element.prototype.scrollTo

if (!('showModal' in HTMLDialogElement.prototype)) {
  Object.assign(HTMLDialogElement.prototype, {
    showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '')
    },
    close(this: HTMLDialogElement) {
      if (!this.hasAttribute('open')) return
      this.removeAttribute('open')
      this.dispatchEvent(new Event('close'))
    },
  })
}
