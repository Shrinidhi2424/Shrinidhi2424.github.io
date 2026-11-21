import { moreProjects } from '../content/projects'
import { sectionHeads } from '../content/sections'
import { Icon } from './Icon'
import styles from './MoreProjects.module.css'

export function MoreProjects() {
  return (
    <section className={styles.section} id="more-projects" aria-labelledby="more-head">
      <div className={`container ${styles.grid}`}>
        <h2 id="more-head" className={styles.head}>
          {sectionHeads.moreProjects}
        </h2>
        <ul className={styles.rows}>
          {moreProjects.map((p) => (
            <li key={p.name} className={styles.row}>
              <div className={styles.nameCell}>
                <a className={styles.name} href={p.repo} target="_blank" rel="noopener noreferrer">
                  {p.name}
                  <Icon name="external" size={16} />
                  <span className="visually-hidden"> (code on GitHub, opens in a new tab)</span>
                </a>
                {p.label && <span className={styles.label}>{p.label === 'team' ? 'Team project' : 'Assignment'}</span>}
              </div>
              <div className={styles.body}>
                {/* On a team project the line shown is his own part. */}
                <p>{p.part ?? p.oneLiner}</p>
                <ul className={styles.techList} aria-label={`${p.name} stack`}>
                  {p.tags.map((t) => (
                    <li key={t} className="mono">
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
