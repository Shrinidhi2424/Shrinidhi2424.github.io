# Shrinidhi Shetty: portfolio

A single-page developer portfolio: React 19, Vite and TypeScript, plain CSS with design tokens. Live at https://shrinidhi2424.github.io.

## Run

Needs Node 22 and npm.

    npm install
    npm run dev           # http://localhost:5173
    npm run build         # type-check, build, then prerender the page into dist/
    npm run preview       # serve dist/ at http://localhost:4173 (add -- --host for a phone on the same Wi-Fi)

## Check

    npm run lint          # oxlint
    npm run test -- --run # Vitest smoke tests
    npm run test:e2e      # Playwright, one end-to-end run; starts the dev server and uses the installed Chrome

## Where things live

- `src/content/`: every word and fact on the page, typed (profile, projects, experience, education, stack, section heads). Edit copy here, nowhere else.
- `src/components/`: one component and one CSS module each. The case drawer and the command palette load on demand (`Deferred.tsx`).
- `src/diagrams/`: the architecture diagram for each featured project.
- `src/styles/`: `tokens.css` (every colour, font and space; light and dark), `base.css`, `global.css`.
- `src/assets/screens/`: project captures as `.webp`. Wide ones have an 800px variant for phones: after adding or replacing a capture run `python scripts/make-variants.py` (needs Pillow) and add its size to `src/lib/screens.ts`.
- `public/`: the résumé PDF, fonts, icons, share image, `404.html`, `robots.txt`, `sitemap.xml`.
- `scripts/prerender.mjs`: writes the rendered page into `dist/index.html`, so it reads without JavaScript and the browser then hydrates it.

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: install, lint, test, build, then publish `dist/` to GitHub Pages. In the repository settings, Pages must be set to **Source: GitHub Actions**. Progress shows in the repository's Actions tab. The site is a user site, so it is served from the domain root (`base: '/'` in `vite.config.ts`).
