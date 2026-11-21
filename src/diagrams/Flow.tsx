import { useId } from 'react'
import styles from './Flow.module.css'

export type FlowNode = { id: string; label: string; tech?: string; dashed?: boolean }
export type FlowSpec = {
  title: string
  /** One sentence a screen reader hears instead of the drawing. */
  description: string
  rows: FlowNode[][]
  /** [from, to] node ids. Default: each row joins the next, wherever one side is a single box. */
  edges?: [string, string][]
}

const W = 640
const BOX_H = 58
const ROW_GAP = 34
const COL_GAP = 16

/** A small architecture diagram of a real system, drawn in the theme's tokens so it holds in both modes. */
export function Flow({ spec }: { spec: FlowSpec }) {
  const uid = useId().replace(/:/g, '')
  const pos = new Map<string, { x: number; y: number; w: number }>()

  spec.rows.forEach((row, r) => {
    const n = row.length
    const w = Math.min(300, (W - COL_GAP * (n - 1)) / n)
    const total = w * n + COL_GAP * (n - 1)
    const x0 = (W - total) / 2
    row.forEach((node, c) => pos.set(node.id, { x: x0 + c * (w + COL_GAP), y: r * (BOX_H + ROW_GAP), w }))
  })

  const edges: [string, string][] =
    spec.edges ??
    spec.rows.slice(1).flatMap((row, i) => {
      const prev = spec.rows[i]
      if (prev.length !== 1 && row.length !== 1) return prev.map((p, k) => [p.id, row[Math.min(k, row.length - 1)].id] as [string, string])
      return prev.flatMap((p) => row.map((q) => [p.id, q.id] as [string, string]))
    })

  const H = spec.rows.length * BOX_H + (spec.rows.length - 1) * ROW_GAP
  const dense = Math.max(...spec.rows.map((r) => r.length)) >= 4

  return (
    <>
    <svg className={`${styles.flow} diagram`} viewBox={`-2 -2 ${W + 4} ${H + 4}`} role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
      <title id={`${uid}-t`}>{spec.title}</title>
      <desc id={`${uid}-d`}>{spec.description}</desc>
      <defs>
        <marker id={`${uid}-a`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 8 4 0 8z" className={styles.head} />
        </marker>
      </defs>
      {edges.map(([a, b]) => {
        const p = pos.get(a)
        const q = pos.get(b)
        if (!p || !q) return null
        const x1 = p.x + p.w / 2
        const y1 = p.y + BOX_H
        const x2 = q.x + q.w / 2
        const y2 = q.y - 2
        const my = (y1 + y2) / 2
        return <path key={a + b} d={`M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`} className={styles.edge} markerEnd={`url(#${uid}-a)`} />
      })}
      {spec.rows.flat().map((node) => {
        const p = pos.get(node.id)!
        const cx = p.x + p.w / 2
        return (
          <g key={node.id}>
            <rect x={p.x} y={p.y} width={p.w} height={BOX_H} rx="6" className={node.dashed ? styles.boxDashed : styles.box} />
            <text x={cx} y={p.y + (node.tech ? 25 : 34)} textAnchor="middle" className={dense ? styles.labelS : styles.label}>
              {node.label}
            </text>
            {node.tech && (
              <text x={cx} y={p.y + 44} textAnchor="middle" className={dense ? styles.techS : styles.tech}>
                {node.tech}
              </text>
            )}
          </g>
        )
      })}
    </svg>
    {/* On a phone the same system reads as a numbered list: the drawing would scale its text to about 6px. */}
    <ol className={styles.list} aria-label={spec.title}>
      {spec.rows.map((row, r) => (
        <li key={r} className={styles.step}>
          {row.map((node) => (
            <span key={node.id} className={node.dashed ? styles.nodeDashed : styles.node}>
              <span className={styles.nodeLabel}>{node.label}</span>
              {node.tech && <span className={styles.nodeTech}>{node.tech}</span>}
            </span>
          ))}
        </li>
      ))}
    </ol>
    </>
  )
}
