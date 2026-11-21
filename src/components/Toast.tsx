import { useEffect, useRef, useState } from 'react'
import styles from './Toast.module.css'

/** One short status line for effects the visitor cannot see (a copy from the palette). */
export function Toast() {
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    const onShow = (e: Event) => {
      setMessage((e as CustomEvent<string>).detail)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setMessage(''), 2600)
    }
    window.addEventListener('toast:show', onShow)
    return () => {
      window.removeEventListener('toast:show', onShow)
      window.clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className={styles.region} role="status" aria-live="polite">
      {message && <p className={styles.toast}>{message}</p>}
    </div>
  )
}
