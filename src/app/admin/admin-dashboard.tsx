'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useRef, useState, useTransition } from 'react'

import type {
  AdminChatPatch,
  AdminChatSortKey,
  AdminChatsResponse,
  AdminChatUpdateResult,
  ChatConfiguration,
  SortDirection,
} from '@/lib/admin-types'
import styles from './admin.module.css'

interface AdminDashboardProps {
  initialData: AdminChatsResponse
  updateChat: (input: AdminChatPatch) => Promise<AdminChatUpdateResult>
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Europe/Stockholm',
})

function formatDate(value?: number): string {
  return value ? dateFormatter.format(value) : 'Never'
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase()).join('') || '#'
}

function mergeConfiguration<T extends { chatId: string }>(
  chat: T,
  configuration: ChatConfiguration,
): T & ChatConfiguration & { configured: true } {
  return { ...chat, ...configuration, configured: true }
}

function Switch({
  checked,
  disabled,
  label,
  pending,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  label: string
  pending?: boolean
  onChange: () => void
}) {
  return (
    <button
      aria-checked={checked}
      aria-label={label}
      className={styles.switch}
      data-checked={checked}
      disabled={disabled || pending}
      role="switch"
      type="button"
      onClick={onChange}
    >
      <span className={styles.switchTrack} aria-hidden="true">
        <span className={styles.switchThumb} />
      </span>
      <span className={styles.switchText}>
        {pending ? 'Saving…' : checked ? 'On' : disabled ? 'Locked' : 'Off'}
      </span>
    </button>
  )
}

function TelegramMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21.8 3.6 18.7 19c-.2 1.1-.9 1.4-1.8.9l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.8-8c.4-.3-.1-.5-.6-.2L6.5 13 1.8 11.5c-1-.3-1-1 .2-1.5L20.4 3c.9-.3 1.6.2 1.4.6Z" />
    </svg>
  )
}

function SortButton({
  activeDirection,
  children,
  onClick,
}: {
  activeDirection?: SortDirection
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button className={styles.sortButton} type="button" onClick={onClick}>
      {children}
      {activeDirection ? (
        <span aria-label={`${activeDirection}ending`}>
          {activeDirection === 'asc' ? '↑' : '↓'}
        </span>
      ) : null}
    </button>
  )
}

export function AdminDashboard({
  initialData,
  updateChat,
}: AdminDashboardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [, startNavigation] = useTransition()
  const [localConfigurations, setLocalConfigurations] = useState<
    Record<string, ChatConfiguration>
  >({})
  const [pendingChats, setPendingChats] = useState<Set<string>>(() => new Set())
  const [notice, setNotice] = useState<
    { kind: 'error' | 'success'; text: string } | undefined
  >()

  useEffect(
    () => () => {
      if (searchTimer.current) clearTimeout(searchTimer.current)
    },
    [],
  )

  const chats = useMemo(
    () =>
      initialData.chats.map((chat) => {
        const local = localConfigurations[chat.chatId]
        return local && local.version > chat.version
          ? mergeConfiguration(chat, local)
          : chat
      }),
    [initialData.chats, localConfigurations],
  )

  const adminName =
    initialData.admin.name ||
    (initialData.admin.username
      ? `@${initialData.admin.username}`
      : `Telegram ${initialData.admin.id}`)

  function navigate(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    startNavigation(() => {
      router.replace(next.size ? `${pathname}?${next}` : pathname)
    })
  }

  function sortBy(sort: AdminChatSortKey) {
    const direction =
      initialData.query.sort === sort && initialData.query.direction === 'asc'
        ? 'desc'
        : 'asc'
    navigate({ sort, direction, page: undefined })
  }

  function scheduleSearch(value: string) {
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      navigate({ q: value.trim() || undefined, page: undefined })
    }, 300)
  }

  async function saveChat(input: AdminChatPatch, chatName: string) {
    setPendingChats((current) => new Set(current).add(input.chatId))
    setNotice(undefined)
    try {
      const result = await updateChat(input)
      if (!result.ok) {
        setNotice({ kind: 'error', text: result.error })
        if (result.conflict) router.refresh()
        return
      }

      setLocalConfigurations((current) => ({
        ...current,
        [input.chatId]: result.configuration,
      }))
      setNotice({ kind: 'success', text: `${chatName} updated.` })
      router.refresh()
    } catch {
      setNotice({
        kind: 'error',
        text: 'The update did not reach the server. Try again.',
      })
    } finally {
      setPendingChats((current) => {
        const next = new Set(current)
        next.delete(input.chatId)
        return next
      })
    }
  }

  const { pagination, query, summary } = initialData
  const firstVisible = pagination.total
    ? (pagination.page - 1) * pagination.pageSize + 1
    : 0
  const lastVisible = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total,
  )

  return (
    <main className={styles.dashboard}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandIcon}>
              <TelegramMark />
            </span>
            <span>
              <strong>Control room</strong>
              <small>Telegram agent</small>
            </span>
          </Link>
          <div className={styles.ownerMenu}>
            <span className={styles.ownerAvatar}>{initials(adminName)}</span>
            <span className={styles.ownerIdentity}>
              <strong>{adminName}</strong>
              <small>Owner · {initialData.admin.id}</small>
            </span>
            <Link className={styles.logoutLink} href="/logout" prefetch={false}>
              Sign out
            </Link>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <section className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Live configuration</p>
            <h1>Chats</h1>
            <p>
              Control the outer AI allowlist and each chat&apos;s agent switch.
            </p>
          </div>
          <span className={styles.connectionStatus}>
            <span /> AWS connected
          </span>
        </section>

        <dl className={styles.metrics}>
          <div>
            <dt>Known chats</dt>
            <dd>{summary.total}</dd>
            <span>Seen by the bot</span>
          </div>
          <div>
            <dt>AI allowed</dt>
            <dd>{summary.allowed}</dd>
            <span>Owner allowlist</span>
          </div>
          <div>
            <dt>Agent active</dt>
            <dd>{summary.enabled}</dd>
            <span>Allowed and switched on</span>
          </div>
        </dl>

        <section className={styles.directory} aria-labelledby="chat-directory">
          <div className={styles.directoryHeader}>
            <div>
              <h2 id="chat-directory">Chat directory</h2>
              <p>
                Showing {firstVisible}–{lastVisible} of {pagination.total}
                {pagination.total !== summary.total
                  ? ` filtered · ${summary.total} known`
                  : ' chats'}
              </p>
            </div>
            <div className={styles.controls}>
              <label className={styles.searchBox}>
                <span className={styles.visuallyHidden}>
                  Search chats by name, username or ID
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
                </svg>
                <input
                  defaultValue={query.q}
                  key={query.q}
                  type="search"
                  placeholder="Search name, @username or ID"
                  onChange={(event) => scheduleSearch(event.target.value)}
                />
              </label>
              <label className={styles.sortSelect}>
                <span className={styles.visuallyHidden}>Filter AI access</span>
                <select
                  aria-label="Filter AI access"
                  value={query.aiAccess}
                  onChange={(event) =>
                    navigate({ aiAccess: event.target.value, page: undefined })
                  }
                >
                  <option value="all">All AI access</option>
                  <option value="allowed">AI allowed</option>
                  <option value="blocked">AI blocked</option>
                </select>
              </label>
            </div>
          </div>

          <div
            className={`${styles.notice} ${notice ? styles[`notice_${notice.kind}`] : ''}`}
            aria-live="polite"
          >
            {notice?.text ?? '\u00a0'}
          </div>

          <div className={styles.tableHeader}>
            <SortButton
              activeDirection={
                query.sort === 'name' ? query.direction : undefined
              }
              onClick={() => sortBy('name')}
            >
              Chat
            </SortButton>
            <SortButton
              activeDirection={
                query.sort === 'lastActivityAt' ? query.direction : undefined
              }
              onClick={() => sortBy('lastActivityAt')}
            >
              Last active
            </SortButton>
            <SortButton
              activeDirection={
                query.sort === 'aiAccess' ? query.direction : undefined
              }
              onClick={() => sortBy('aiAccess')}
            >
              AI access
            </SortButton>
            <SortButton
              activeDirection={
                query.sort === 'agent' ? query.direction : undefined
              }
              onClick={() => sortBy('agent')}
            >
              Agent
            </SortButton>
          </div>

          <div className={styles.chatList}>
            {chats.map((chat) => {
              const pending = pendingChats.has(chat.chatId)
              return (
                <article className={styles.chatRow} key={chat.chatId}>
                  <div className={styles.chatIdentity}>
                    <span className={styles.chatAvatar} aria-hidden="true">
                      {initials(chat.name)}
                    </span>
                    <span className={styles.chatDetails}>
                      <strong>{chat.name}</strong>
                      <span>
                        {chat.username ? `@${chat.username} · ` : ''}
                        <b>{chat.type ?? 'chat'}</b>
                      </span>
                      <code>{chat.chatId}</code>
                    </span>
                  </div>

                  <div className={styles.activityCell}>
                    <span className={styles.mobileLabel}>Last active</span>
                    <strong>{formatDate(chat.lastActivityAt)}</strong>
                    <small>
                      {chat.configured
                        ? `Config v${chat.version}`
                        : 'No config yet'}
                    </small>
                  </div>

                  <div className={styles.flagCell}>
                    <span className={styles.mobileLabel}>AI access</span>
                    <Switch
                      checked={chat.aiAllowed}
                      label={`${chat.aiAllowed ? 'Disallow' : 'Allow'} AI for ${chat.name}`}
                      pending={pending}
                      onChange={() =>
                        void saveChat(
                          {
                            chatId: chat.chatId,
                            version: chat.version,
                            aiAllowed: !chat.aiAllowed,
                          },
                          chat.name,
                        )
                      }
                    />
                    <small>Changed {formatDate(chat.allowUpdatedAt)}</small>
                  </div>

                  <div className={styles.flagCell}>
                    <span className={styles.mobileLabel}>Agent</span>
                    <Switch
                      checked={chat.agenticEnabled}
                      disabled={!chat.aiAllowed}
                      label={`${chat.agenticEnabled ? 'Disable' : 'Enable'} agent for ${chat.name}`}
                      pending={pending}
                      onChange={() =>
                        void saveChat(
                          {
                            chatId: chat.chatId,
                            version: chat.version,
                            agenticEnabled: !chat.agenticEnabled,
                          },
                          chat.name,
                        )
                      }
                    />
                    <small>Changed {formatDate(chat.toggledAt)}</small>
                  </div>
                </article>
              )
            })}
          </div>

          {chats.length === 0 ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">⌕</span>
              <strong>No matching chats</strong>
              <p>Try a name, username, or the numeric Telegram chat ID.</p>
            </div>
          ) : null}

          <footer className={styles.pagination}>
            <label>
              <span>Rows</span>
              <select
                aria-label="Rows per page"
                value={pagination.pageSize}
                onChange={(event) =>
                  navigate({ pageSize: event.target.value, page: undefined })
                }
              >
                {[10, 20, 50, 100].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <div>
              <button
                disabled={pagination.page <= 1}
                type="button"
                onClick={() => navigate({ page: String(pagination.page - 1) })}
              >
                Previous
              </button>
              <button
                disabled={pagination.page >= pagination.totalPages}
                type="button"
                onClick={() => navigate({ page: String(pagination.page + 1) })}
              >
                Next
              </button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  )
}
