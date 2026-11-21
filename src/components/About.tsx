import { profile } from '../content/profile'
import styles from './About.module.css'

// Statement: the middle About sentence set large; the other two beside each other beneath it.
// Columns 11 and 12 stay open so a portrait can join later without a redesign.
export function About() {
  const [studying, building, interests] = profile.about
  return (
    <section className={styles.section} id="about" aria-labelledby="about-head">
      <div className={`container ${styles.grid}`}>
        <h2 id="about-head" className="visually-hidden">
          About me
        </h2>
        <p className={styles.statement}>{building}</p>
        <p className={styles.note}>{studying}</p>
        <p className={styles.note}>{interests}</p>
      </div>
    </section>
  )
}
