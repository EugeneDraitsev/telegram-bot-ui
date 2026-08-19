import 'server-only'

import { getAdminApiBaseUrl } from './admin-config'
import type {
  AdminChatListOptions,
  AdminChatsResponse,
  ChatAccessResponse,
  ChatConfiguration,
  SessionResponse,
  UserChatsResponse,
} from './admin-types'

export class AdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'AdminApiError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function requestAdminApi<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${getAdminApiBaseUrl()}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...init.headers,
    },
  })

  const value: unknown = await response.json().catch(() => undefined)
  if (!response.ok) {
    const message =
      isRecord(value) && typeof value.error === 'string'
        ? value.error
        : 'Admin API request failed'
    throw new AdminApiError(message, response.status)
  }
  return value as T
}

export function createSession(
  idToken: string,
  nonce: string,
): Promise<SessionResponse> {
  return requestAdminApi('/session', {
    method: 'POST',
    body: JSON.stringify({ idToken, nonce }),
  })
}

export function getUserChats(token: string): Promise<UserChatsResponse> {
  return requestAdminApi('/chats', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getChatAccess(
  token: string,
  chatId: string,
): Promise<ChatAccessResponse> {
  return requestAdminApi(`/chats/${encodeURIComponent(chatId)}/access`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function getAdminChats(
  token: string,
  options: AdminChatListOptions = {},
): Promise<AdminChatsResponse> {
  const search = new URLSearchParams()
  if (options.page) search.set('page', String(options.page))
  if (options.pageSize) search.set('pageSize', String(options.pageSize))
  if (options.q) search.set('q', options.q)
  if (options.aiAccess) search.set('aiAccess', options.aiAccess)
  if (options.sort) search.set('sort', options.sort)
  if (options.direction) search.set('direction', options.direction)
  const query = search.size ? `?${search}` : ''

  return requestAdminApi(`/admin/chats${query}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function patchAdminChat(
  token: string,
  chatId: string,
  body: {
    version: number
    aiAllowed?: boolean
    agenticEnabled?: boolean
  },
): Promise<ChatConfiguration> {
  const response = await requestAdminApi<{ configuration: ChatConfiguration }>(
    `/admin/chats/${encodeURIComponent(chatId)}`,
    {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    },
  )
  return response.configuration
}
