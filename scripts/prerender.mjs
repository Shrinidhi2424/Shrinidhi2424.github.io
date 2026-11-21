// After `vite build` and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`: render the page into
// dist/index.html, so it reads without JavaScript (and to crawlers), then the client hydrates it.
import { readFile, rm, writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const server = pathToFileURL(resolve('dist-ssr/entry-server.js')).href
const { render } = await import(server)
const file = resolve('dist/index.html')
const page = await readFile(file, 'utf8')
const marker = '<div id="root"></div>'
if (!page.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)
const html = render()
await writeFile(file, page.replace(marker, `<div id="root">${html}</div>`))
await rm(resolve('dist-ssr'), { recursive: true, force: true })
console.log(`prerender: ${Math.round(html.length / 1024)} KB of HTML written into dist/index.html`)
