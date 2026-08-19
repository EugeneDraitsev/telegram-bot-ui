import 'server-only'

import { getAdminApiBaseUrl } from './admin-config'
import type {
  AdminChatsResponse,
  AdminSessionResponse,
  ChatConfiguration,
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

async function requestAdminApi<T>(
  path: string,
  init: RequestInit,
): Promise<T> {
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

export function createAdminSession(
  idToken: string,
  nonce: string,
): Promise<AdminSessionResponse> {
  return requestAdminApi('/admin/session', {
    method: 'POST',
    body: JSON.stringify({ idToken, nonce }),
  })
}

export function getAdminChats(token: string): Promise<AdminChatsResponse> {
  return requestAdminApi('/admin/chats', {
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
