import { StrictMode, startTransition } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/geist-mono'
import './styles/global.css'
import App from './App.tsx'

const root = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)
// The build prerenders the page into #root (scripts/prerender.mjs); the dev server serves it empty.
// Hydrating in a transition lets React yield between chunks, so the page stays responsive while it wakes.
if (root.hasChildNodes()) startTransition(() => void hydrateRoot(root, app))
else createRoot(root).render(app)
