import { redirect } from 'next/navigation'

import { AdminApiError, getAdminChats } from '@/lib/admin-api'
import { getSessionToken } from '@/lib/admin-session'
import { resolveChatPhotos } from '@/lib/telegram'
import type {
  AdminChatListOptions,
  AdminChatSortKey,
  AdminChatsResponse,
  AiAccessFilter,
  SortDirection,
} from '@/lib/admin-types'
import { updateChatConfiguration } from './actions'
import { AdminDashboard } from './admin-dashboard'

interface AdminPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function parseOptions(
  values: Record<string, string | string[] | undefined>,
): AdminChatListOptions {
  const aiAccess = first(values.aiAccess)
  const sort = first(values.sort)
  const direction = first(values.direction)
  return {
    page: Number(first(values.page)) || undefined,
    pageSize: Number(first(values.pageSize)) || undefined,
    q: first(values.q),
    aiAccess: (['all', 'allowed', 'blocked'].includes(aiAccess ?? '')
      ? aiAccess
      : undefined) as AiAccessFilter | undefined,
    sort: (['name', 'lastActivityAt', 'aiAccess', 'agent'].includes(sort ?? '')
      ? sort
      : undefined) as AdminChatSortKey | undefined,
    direction: (['asc', 'desc'].includes(direction ?? '')
      ? direction
      : undefined) as SortDirection | undefined,
  }
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const token = await getSessionToken()
  if (!token) redirect('/sign-in?backUrl=%2Fadmin')

  let data: AdminChatsResponse
  try {
    data = await getAdminChats(token, parseOptions(await searchParams))
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 401) {
      redirect('/sign-in?error=session_expired&backUrl=%2Fadmin')
    }
    if (error instanceof AdminApiError && error.status === 403) {
      redirect('/')
    }
    throw error
  }

  return (
    <AdminDashboard
      initialData={data}
      updateChat={updateChatConfiguration}
      photos={await resolveChatPhotos(data.chats)}
    />
  )
}
