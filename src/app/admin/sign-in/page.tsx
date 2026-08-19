import Link from 'next/link'

import styles from '../admin.module.css'

const errorMessages: Record<string, string> = {
  invalid_state: 'That login request expired. Please start again.',
  login_failed: 'Telegram login could not be completed.',
  not_allowed: 'This Telegram account is not the configured bot owner.',
  session_expired: 'Your admin session expired. Sign in again.',
  telegram_rejected: 'Telegram login was cancelled.',
  token_exchange_failed: 'Telegram did not accept the login code.',
}

interface SignInPageProps {
  searchParams: Promise<{ error?: string | string[] }>
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.8 3.6 18.7 19c-.2 1.1-.9 1.4-1.8.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.5 13 1.8 11.5c-1-.3-1-1 .2-1.5L20.4 3c.9-.3 1.6.2 1.4.6Z" />
    </svg>
  )
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const error = (await searchParams).error
  const errorCode = Array.isArray(error) ? error[0] : error
  const errorMessage = errorCode ? errorMessages[errorCode] : undefined

  return (
    <main className={styles.signInPage}>
      <section className={styles.signInCard}>
        <div className={styles.signInBrand} aria-hidden="true">
          <span className={styles.brandPulse} />
          <span className={styles.brandMark}>A</span>
        </div>
        <p className={styles.eyebrow}>Private workspace</p>
        <h1>Bot control room</h1>
        <p className={styles.signInLead}>
          Inspect chats and control where the AI agent is allowed to run.
          Access is limited to the Telegram account configured as the bot owner.
        </p>

        {errorMessage ? (
          <p className={styles.signInError} role="alert">
            {errorMessage}
          </p>
        ) : null}

        <Link
          className={styles.telegramButton}
          href="/admin/login"
          prefetch={false}
        >
          <span className={styles.telegramIcon}>
            <TelegramLogo />
          </span>
          Continue with Telegram
        </Link>

        <div className={styles.securityNote}>
          <span className={styles.securityDot} />
          <span>
            Telegram verifies your identity. Cloud credentials never reach the
            browser.
          </span>
        </div>
      </section>
    </main>
  )
}
