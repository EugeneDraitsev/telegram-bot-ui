import Link from 'next/link'

import { AdminApiError, getUserChats } from '@/lib/admin-api'
import { getSessionToken } from '@/lib/admin-session'
import type { UserChatsResponse } from '@/lib/admin-types'
import styles from './home.module.css'

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Stockholm',
})

function displayName(data: UserChatsResponse): string {
  return (
    data.user.name ||
    (data.user.username ? `@${data.user.username}` : `Telegram ${data.user.id}`)
  )
}

export function SignedOutHome({ expired = false }: { expired?: boolean }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.mark}>T</span>
        <p className={styles.eyebrow}>Telegram bot statistics</p>
        <h1>Your chats, without public links.</h1>
        <p className={styles.lead}>
          Sign in with Telegram to see chats where the bot has already observed
          your account. Existing private links from <code>/s</code> keep
          working.
        </p>
        {expired ? (
          <p className={styles.warning} role="alert">
            Your session expired. Sign in again.
          </p>
        ) : null}
        <Link
          className={styles.primaryAction}
          href="/login?backUrl=%2F"
          prefetch={false}
        >
          Continue with Telegram
        </Link>
      </section>
    </main>
  )
}

export function UserHome({ data }: { data: UserChatsResponse }) {
  const name = displayName(data)
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.wordmark}>
          Telegram stats
        </Link>
        <nav className={styles.nav} aria-label="Account">
          <span>{name}</span>
          {data.user.isAdmin ? <Link href="/admin">Control room</Link> : null}
          <Link href="/logout" prefetch={false}>
            Sign out
          </Link>
        </nav>
      </header>

      <section className={styles.workspace}>
        <p className={styles.eyebrow}>Signed in as {name}</p>
        <h1>Your chats</h1>
        <p className={styles.lead}>
          These are chats where this bot has recorded activity from your
          Telegram account.
        </p>

        {data.chats.length ? (
          <div className={styles.chatGrid}>
            {data.chats.map((chat) => (
              <Link
                className={styles.chatCard}
                href={`/chat/${encodeURIComponent(chat.chatId)}`}
                key={chat.chatId}
              >
                <span className={styles.chatType}>{chat.type ?? 'chat'}</span>
                <strong>{chat.name}</strong>
                <span>
                  {chat.username ? `@${chat.username} · ` : ''}
                  {chat.messageCount.toLocaleString()} messages from you
                </span>
                <small>
                  {chat.lastActivityAt
                    ? `Last seen ${dateFormatter.format(chat.lastActivityAt)}`
                    : 'No activity timestamp'}
                </small>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <strong>No chats found yet</strong>
            <p>
              Send a message in a chat that contains the bot, then refresh this
              page.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default async function IndexPage() {
  const token = await getSessionToken()
  if (!token) return <SignedOutHome />

  let data: UserChatsResponse | undefined
  try {
    data = await getUserChats(token)
  } catch (error) {
    if (!(error instanceof AdminApiError) || error.status !== 401) throw error
  }

  return data ? <UserHome data={data} /> : <SignedOutHome expired />
}
