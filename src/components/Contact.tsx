import { useEffect, useRef, useState } from 'react'
import { profile } from '../content/profile'
import { sectionHeads } from '../content/sections'
import { Icon } from './Icon'
import { copyText } from '../lib/toast'
import styles from './Contact.module.css'


export function Contact() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const onCopy = async () => {
    try {
      await copyText(profile.email)
      setState('copied')
    } catch {
      setState('failed')
    }
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), 2400)
  }

  return (
    <section className={styles.section} id="contact" aria-labelledby="contact-head">
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro}>
          <h2 id="contact-head">{sectionHeads.contact}</h2>
          <p className={styles.place}>Based in Mangaluru, Karnataka.</p>
        </div>

        <div className={styles.reach}>
          <a className={styles.email} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <div className={styles.actions}>
            <button type="button" className="btn btn--card" onClick={onCopy}>
              <Icon name={state === 'copied' ? 'check' : 'copy'} />
              {state === 'copied' ? 'Copied' : 'Copy address'}
            </button>
          </div>
          <p className={styles.status} role="status" aria-live="polite">
            {state === 'copied' ? 'Email address copied.' : state === 'failed' ? 'Copying was blocked. Select the address above instead.' : ''}
          </p>
          <ul className={styles.links}>
            <li>
              <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">
                <Icon name="linkedin" />
                LinkedIn
              </a>
            </li>
            <li>
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer">
                <Icon name="github" />
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.resume.href} target="_blank" rel="noopener noreferrer">
                <Icon name="file" />
                Résumé (PDF)
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
