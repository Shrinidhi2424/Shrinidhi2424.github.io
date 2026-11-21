import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/** The page as static HTML, for scripts/prerender.mjs: readable without JavaScript, then hydrated. */
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
