import Link from 'next/link'

import { AdminApiError, getChatAccess } from '@/lib/admin-api'
import { getSessionToken } from '@/lib/admin-session'
import { getChatPhotoFileId } from '@/lib/telegram'
import styles from '../../home.module.css'
import { ChatDashboard } from './chat-dashboard'

interface ChatPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ access?: string | string[] }>
}

export function ChatAccessMessage({
  chatId,
  denied = false,
}: {
  chatId: string
  denied?: boolean
}) {
  const backUrl = `/chat/${encodeURIComponent(chatId)}`
  const loginHref = `/login?${new URLSearchParams({ backUrl })}`
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={styles.mark}>T</span>
        <p className={styles.eyebrow}>Private chat statistics</p>
        <h1>
          {denied ? 'This chat is not in your list.' : 'Sign in to continue.'}
        </h1>
        <p className={styles.lead}>
          {denied
            ? 'The bot has not observed activity from your Telegram account in this chat.'
            : 'Telegram login lets us match this page to chats where the bot has observed your account.'}
        </p>
        {denied ? (
          <Link className={styles.primaryAction} href="/">
            View your chats
          </Link>
        ) : (
          <Link
            className={styles.primaryAction}
            href={loginHref}
            prefetch={false}
          >
            Continue with Telegram
          </Link>
        )}
      </section>
    </main>
  )
}

export default async function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  const { id } = await params
  const access = (await searchParams).access
  const legacyAccessToken = Array.isArray(access) ? access[0] : access
  if (legacyAccessToken) {
    return (
      <ChatDashboard
        chatId={id}
        accessToken={legacyAccessToken}
        hasPhoto={Boolean(await getChatPhotoFileId(id))}
      />
    )
  }

  const sessionToken = await getSessionToken()
  if (!sessionToken) return <ChatAccessMessage chatId={id} />

  let accessToken: string | undefined
  let accessDenied = false
  try {
    accessToken = (await getChatAccess(sessionToken, id)).accessToken
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) {
      accessToken = undefined
    } else if (error instanceof AdminApiError && error.status === 403) {
      accessDenied = true
    } else {
      throw error
    }
  }

  if (accessDenied) return <ChatAccessMessage chatId={id} denied />
  if (!accessToken) return <ChatAccessMessage chatId={id} />

  return (
    <ChatDashboard
      chatId={id}
      accessToken={accessToken}
      hasPhoto={Boolean(await getChatPhotoFileId(id))}
    />
  )
}
