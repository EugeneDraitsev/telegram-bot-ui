'use client'

import Link from 'next/link'
import { useEffect } from 'react'

import styles from './admin.module.css'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className={styles.signInPage}>
      <section className={styles.signInCard}>
        <p className={styles.eyebrow}>Admin API unavailable</p>
        <h1>Couldn&apos;t load the control room</h1>
        <p className={styles.signInLead}>
          The bot data is safe. Retry the request or sign in again if the
          session has changed.
        </p>
        <button className={styles.primaryButton} type="button" onClick={reset}>
          Try again
        </button>
        <Link
          className={styles.secondaryLink}
          href="/admin/logout"
          prefetch={false}
        >
          Sign out
        </Link>
      </section>
    </main>
  )
}
