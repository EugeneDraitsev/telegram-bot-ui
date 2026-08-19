import { redirect } from 'next/navigation'

import { AdminApiError, getAdminChats } from '@/lib/admin-api'
import { getAdminSessionToken } from '@/lib/admin-session'
import type { AdminChatsResponse } from '@/lib/admin-types'
import { updateChatConfiguration } from './actions'
import { AdminDashboard } from './admin-dashboard'

export default async function AdminPage() {
  const token = await getAdminSessionToken()
  if (!token) redirect('/admin/sign-in')

  let data: AdminChatsResponse
  try {
    data = await getAdminChats(token)
  } catch (error) {
    if (
      error instanceof AdminApiError &&
      (error.status === 401 || error.status === 403)
    ) {
      redirect('/admin/sign-in?error=session_expired')
    }
    throw error
  }

  return (
    <AdminDashboard
      initialData={data}
      updateChat={updateChatConfiguration}
    />
  )
}
