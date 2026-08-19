'use client'

import Link from 'next/link'
import { useDeferredValue, useMemo, useState } from 'react'

import type {
  AdminChatPatch,
  AdminChatsResponse,
  AdminChatUpdateResult,
  ChatConfiguration,
} from '@/lib/admin-types'
import styles from './admin.module.css'

type SortKey = 'lastActivityAt' | 'name' | 'allowUpdatedAt' | 'toggledAt'
type SortDirection = 'asc' | 'desc'

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

export function AdminDashboard({
  initialData,
  updateChat,
}: AdminDashboardProps) {
  const [chats, setChats] = useState(initialData.chats)
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('lastActivityAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [pendingChats, setPendingChats] = useState<Set<string>>(
    () => new Set(),
  )
  const [notice, setNotice] = useState<
    { kind: 'error' | 'success'; text: string } | undefined
  >()
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase())

  const counts = useMemo(
    () => ({
      total: chats.length,
      allowed: chats.filter((chat) => chat.aiAllowed).length,
      enabled: chats.filter(
        (chat) => chat.aiAllowed && chat.agenticEnabled,
      ).length,
    }),
    [chats],
  )

  const visibleChats = useMemo(() => {
    const filtered = deferredQuery
      ? chats.filter((chat) =>
          [
            chat.name,
            chat.username,
            chat.username ? `@${chat.username}` : undefined,
            chat.chatId,
          ]
            .filter(Boolean)
            .some((value) =>
              String(value).toLocaleLowerCase().includes(deferredQuery),
            ),
        )
      : chats

    return [...filtered].sort((left, right) => {
      let comparison: number
      if (sortKey === 'name') {
        comparison = left.name.localeCompare(right.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        })
      } else {
        comparison = (left[sortKey] ?? 0) - (right[sortKey] ?? 0)
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [chats, deferredQuery, sortDirection, sortKey])

  const adminName =
    initialData.admin.name ||
    (initialData.admin.username
      ? `@${initialData.admin.username}`
      : `Telegram ${initialData.admin.id}`)

  async function saveChat(input: AdminChatPatch, chatName: string) {
    setPendingChats((current) => new Set(current).add(input.chatId))
    setNotice(undefined)
    try {
      const result = await updateChat(input)
      if (!result.ok) {
        setNotice({ kind: 'error', text: result.error })
        return
      }

      setChats((current) =>
        current.map((chat) =>
          chat.chatId === input.chatId
            ? mergeConfiguration(chat, result.configuration)
            : chat,
        ),
      )
      setNotice({ kind: 'success', text: `${chatName} updated.` })
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

  return (
    <main className={styles.dashboard}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>
              <TelegramMark />
            </span>
            <span>
              <strong>Control room</strong>
              <small>Telegram agent</small>
            </span>
          </div>
          <div className={styles.ownerMenu}>
            <span className={styles.ownerAvatar}>{initials(adminName)}</span>
            <span className={styles.ownerIdentity}>
              <strong>{adminName}</strong>
              <small>Owner · {initialData.admin.id}</small>
            </span>
            <Link
              className={styles.logoutLink}
              href="/admin/logout"
              prefetch={false}
            >
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
            <dd>{counts.total}</dd>
            <span>Seen by the bot</span>
          </div>
          <div>
            <dt>AI allowed</dt>
            <dd>{counts.allowed}</dd>
            <span>Owner allowlist</span>
          </div>
          <div>
            <dt>Agent active</dt>
            <dd>{counts.enabled}</dd>
            <span>Allowed and switched on</span>
          </div>
        </dl>

        <section className={styles.directory} aria-labelledby="chat-directory">
          <div className={styles.directoryHeader}>
            <div>
              <h2 id="chat-directory">Chat directory</h2>
              <p>
                {visibleChats.length === chats.length
                  ? `${chats.length} chats`
                  : `${visibleChats.length} of ${chats.length} chats`}
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
                  type="search"
                  placeholder="Search name, @username or ID"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className={styles.sortSelect}>
                <span className={styles.visuallyHidden}>Sort chats</span>
                <select
                  value={sortKey}
                  onChange={(event) => setSortKey(event.target.value as SortKey)}
                >
                  <option value="lastActivityAt">Last active</option>
                  <option value="name">Name</option>
                  <option value="allowUpdatedAt">Allow changed</option>
                  <option value="toggledAt">Agent changed</option>
                </select>
              </label>
              <button
                className={styles.directionButton}
                type="button"
                aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                title={`Currently ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
                onClick={() =>
                  setSortDirection((current) =>
                    current === 'asc' ? 'desc' : 'asc',
                  )
                }
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>

          <div
            className={`${styles.notice} ${notice ? styles[`notice_${notice.kind}`] : ''}`}
            aria-live="polite"
          >
            {notice?.text ?? '\u00a0'}
          </div>

          <div className={styles.tableHeader} aria-hidden="true">
            <span>Chat</span>
            <span>Last active</span>
            <span>AI access</span>
            <span>Agent</span>
          </div>

          <div className={styles.chatList}>
            {visibleChats.map((chat) => {
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
                      {chat.configured ? `Config v${chat.version}` : 'No config yet'}
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

          {visibleChats.length === 0 ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">⌕</span>
              <strong>No matching chats</strong>
              <p>Try a name, username, or the numeric Telegram chat ID.</p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  )
}
