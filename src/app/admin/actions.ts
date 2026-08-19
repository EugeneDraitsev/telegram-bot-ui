'use server'

import { redirect } from 'next/navigation'

import { AdminApiError, patchAdminChat } from '@/lib/admin-api'
import { getAdminSessionToken } from '@/lib/admin-session'
import type {
  AdminChatPatch,
  AdminChatUpdateResult,
} from '@/lib/admin-types'

export async function updateChatConfiguration(
  input: AdminChatPatch,
): Promise<AdminChatUpdateResult> {
  const token = await getAdminSessionToken()
  if (!token) {
    redirect('/admin/sign-in?error=session_expired')
  }

  try {
    const configuration = await patchAdminChat(token, input.chatId, {
      version: input.version,
      aiAllowed: input.aiAllowed,
      agenticEnabled: input.agenticEnabled,
    })
    return { ok: true, configuration }
  } catch (error) {
    if (error instanceof AdminApiError) {
      if (error.status === 401 || error.status === 403) {
        redirect('/admin/sign-in?error=session_expired')
      }
      return { ok: false, error: error.message }
    }
    return { ok: false, error: 'Could not update this chat. Try again.' }
  }
}
