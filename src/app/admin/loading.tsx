import styles from './admin.module.css'

export default function AdminLoading() {
  return (
    <main className={styles.loadingPage} aria-busy="true" aria-live="polite">
      <div className={styles.loadingMark} />
      <p>Opening the control room…</p>
    </main>
  )
}
