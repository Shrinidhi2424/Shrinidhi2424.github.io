import { experience } from '../content/experience'
import { education } from '../content/education'
import { sectionHeads } from '../content/sections'
import styles from './Background.module.css'

const span = (start: string, end: string) => `${start} to ${end === 'Present' ? 'present' : end}`

// Rows: the work first, then study and certifications. #experience and #education both land here.
export function Background() {
  const { degree, certifications } = education
  return (
    <section className={styles.section} id="experience" aria-labelledby="background-head">
      <div className={`container ${styles.grid}`}>
        <h2 id="background-head" className={styles.head}>
          {sectionHeads.background}
        </h2>
        <ol className={styles.rows}>
          {experience.map((e) => (
            <li key={e.role + e.start} className={styles.row}>
              <div className={styles.lead}>
                <h3>{e.role}</h3>
                <p className={styles.where}>
                  {e.employment}, {e.organisation}
                </p>
              </div>
              <div className={styles.body}>
                <p className={`mono ${styles.when}`}>{span(e.start, e.end)}</p>
                <p>{e.summary}</p>
                <details className={styles.details}>
                  <summary>What I did</summary>
                  <ul>
                    {e.details.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </details>
              </div>
            </li>
          ))}

          <li className={styles.row} id="education">
            <div className={styles.lead}>
              <h3>
                {degree.degree}, {degree.field}
              </h3>
              <p className={styles.where}>
                {degree.institution}, {degree.city}
              </p>
            </div>
            <div className={styles.body}>
              <p className={`mono ${styles.when}`}>{span(degree.start, degree.end)}</p>
              <p className={styles.grade}>{degree.grade}</p>
            </div>
          </li>

          <li className={styles.row}>
            <div className={styles.lead}>
              <h3>Certifications</h3>
              <p className={styles.where}>{certifications[0]?.issuer}</p>
            </div>
            <div className={styles.body}>
              <ul className={styles.certs}>
                {certifications.map((c) => (
                  <li key={c.name}>{c.name}</li>
                ))}
              </ul>
            </div>
          </li>
        </ol>
      </div>
    </section>
  )
}
