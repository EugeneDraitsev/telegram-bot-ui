'use server'

import { redirect } from 'next/navigation'

import { AdminApiError, patchAdminChat } from '@/lib/admin-api'
import { getSessionToken } from '@/lib/admin-session'
import type { AdminChatPatch, AdminChatUpdateResult } from '@/lib/admin-types'

export async function updateChatConfiguration(
  input: AdminChatPatch,
): Promise<AdminChatUpdateResult> {
  const token = await getSessionToken()
  if (!token) {
    redirect('/sign-in?error=session_expired&backUrl=%2Fadmin')
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
      if (error.status === 401) {
        redirect('/sign-in?error=session_expired&backUrl=%2Fadmin')
      }
      if (error.status === 403) {
        redirect('/')
      }
      return {
        ok: false,
        error: error.message,
        conflict: error.status === 409,
      }
    }
    return { ok: false, error: 'Could not update this chat. Try again.' }
  }
}
