import { StrictMode } from 'react'
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
if (root.hasChildNodes()) hydrateRoot(root, app)
else createRoot(root).render(app)
