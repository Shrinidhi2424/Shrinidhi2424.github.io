import { defineConfig } from '@playwright/test'

// One end-to-end smoke test against the dev server, in the installed Chrome (no browser download).
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:5173', channel: 'chrome', viewport: { width: 1440, height: 900 } },
  webServer: { command: 'npm run dev -- --port 5173 --strictPort', url: 'http://localhost:5173', reuseExistingServer: true, timeout: 60_000 },
  reporter: 'list',
})
