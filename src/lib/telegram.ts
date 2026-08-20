import 'server-only'

import type { Chat } from '@/types'

type TelegramResponse<T> = {
  ok: boolean
  result?: T
  description?: string
  error_code?: number
}

type TelegramFile = {
  file_id: string
  file_unique_id: string
  file_path?: string
  file_size?: number
}

const TELEGRAM_API_BASE = 'https://api.telegram.org'
// Chat photos change rarely, so both the getChat lookup and the file download
// are cached for a day. Without this every chat row in a list would hit the
// Telegram API on each render.
export const TELEGRAM_REVALIDATE_SECONDS = 60 * 60 * 24

export const getTelegramBotToken = () =>
  process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.TOKEN

export const getTelegramFileUrl = (filePath: string) => {
  const token = getTelegramBotToken()
  return token ? `${TELEGRAM_API_BASE}/file/bot${token}/${filePath}` : undefined
}

export const stripImageExtension = (id: string) =>
  id.replace(/\.(?:jpe?g|png|webp)$/i, '')

const requestTelegram = async <T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T | null> => {
  const token = getTelegramBotToken()
  if (!token) return null

  const response = await fetch(`${TELEGRAM_API_BASE}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    next: { revalidate: TELEGRAM_REVALIDATE_SECONDS },
  })

  if (!response.ok) return null

  const data = (await response.json()) as TelegramResponse<T>
  return data.ok ? (data.result ?? null) : null
}

// Never throws: a missing token or a chat the bot cannot see degrades to the
// initials avatar instead of failing the page that asked for it.
export const getTelegramChat = async (chatId: string) => {
  try {
    return await requestTelegram<Chat>('getChat', { chat_id: chatId })
  } catch {
    return null
  }
}

export const getTelegramFile = async (fileId: string) => {
  try {
    return await requestTelegram<TelegramFile>('getFile', { file_id: fileId })
  } catch {
    return null
  }
}

export const getChatPhotoFileId = async (
  chatId: string,
): Promise<string | undefined> =>
  (await getTelegramChat(chatId))?.photo?.small_file_id

// Which chats actually have a photo, so a list can fall back to initials
// instead of rendering a broken image. One getChat per chat, but the responses
// are cached for a day, so a list only pays for chats it has not shown recently.
export const resolveChatPhotos = async (
  chats: { chatId: string }[],
): Promise<Record<string, boolean>> =>
  Object.fromEntries(
    await Promise.all(
      chats.map(
        async (chat) =>
          [chat.chatId, Boolean(await getChatPhotoFileId(chat.chatId))] as const,
      ),
    ),
  )
