// Real pixel sizes of every capture in src/assets/screens (regenerate when a capture changes).
const urls = import.meta.glob('../assets/screens/*.webp', { eager: true, import: 'default' }) as Record<string, string>

const sizes: Record<string, { width: number; height: number }> = {
  'hero-phishguard.webp': { width: 1400, height: 1448 },
  'hero-pulseboard.webp': { width: 1600, height: 762 },
  'hero-resumeai.webp': { width: 1400, height: 1428 },
  'panel-stepsolve.webp': { width: 1800, height: 1484 },
  'phishguard-prediction.webp': { width: 1760, height: 3620 },
  'pulseboard-board.webp': { width: 2400, height: 1067 },
  'pulseboard-presence.webp': { width: 2400, height: 658 },
  'qrag-lab-architecture.webp': { width: 2400, height: 1294 },
  'qrag-lab-pareto.webp': { width: 2400, height: 874 },
  'resumeai-analysis.webp': { width: 1990, height: 3600 },
  'resumeai-cover-letter.webp': { width: 1980, height: 3240 },
  'resumeai-tracker.webp': { width: 2400, height: 1117 },
  'safexplore-report.webp': { width: 367, height: 701 },
  'safexplore-route.webp': { width: 342, height: 702 },
  'stepsolve-secant-steps.webp': { width: 2400, height: 2867 },
  'stepsolve-secant.webp': { width: 2400, height: 1500 },
}

export type Screen = { src: string; width: number; height: number; srcSet?: string }

/** Look up a capture by its file name, as stored in src/content (media.src). Wide captures carry an 800px
 *  variant (scripts/make-variants.py) as a srcset candidate, so phones download a third of the bytes. */
export function screen(file: string): Screen | undefined {
  const src = urls[`../assets/screens/${file}`]
  const size = sizes[file]
  if (!src || !size) return undefined
  const small = urls[`../assets/screens/${file.replace(/\.webp$/, '-800.webp')}`]
  return { src, ...size, srcSet: small ? `${small} 800w, ${src} ${size.width}w` : undefined }
}
