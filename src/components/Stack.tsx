import { stack } from '../content/stack'
import { sectionHeads } from '../content/sections'
import styles from './Stack.module.css'

// Grouped lists only: no bars, percentages or ratings (plan 6.3).
// The optional Core CS line is left out to keep this screen inside the word budget (Hallmark gate 58).
export function Stack() {
  const groups = stack.filter((g) => !g.quiet)
  return (
    <section className={styles.section} id="stack" aria-labelledby="stack-head">
      <div className="container">
        <h2 id="stack-head">{sectionHeads.stack}</h2>
        <dl className={styles.groups}>
          {groups.map((g) => (
            <div key={g.id} className={styles.group}>
              <dt>{g.label}</dt>
              <dd>
                <ul className={styles.techList}>
                  {g.items.map((item) => (
                    <li key={item} className="mono">
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
