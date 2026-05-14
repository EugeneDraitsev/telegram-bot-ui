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
const TELEGRAM_REVALIDATE_SECONDS = 30

export const getTelegramBotToken = () =>
  process.env.BOT_TOKEN || process.env.TELEGRAM_BOT_TOKEN || process.env.TOKEN

const getTelegramApiUrl = (method: string) => {
  const token = getTelegramBotToken()

  if (!token) {
    throw new Error(
      'Missing Telegram bot token. Set BOT_TOKEN, TELEGRAM_BOT_TOKEN, or TOKEN.',
    )
  }

  return `${TELEGRAM_API_BASE}/bot${token}/${method}`
}

export const getTelegramFileUrl = (filePath: string) => {
  const token = getTelegramBotToken()

  if (!token) {
    throw new Error(
      'Missing Telegram bot token. Set BOT_TOKEN, TELEGRAM_BOT_TOKEN, or TOKEN.',
    )
  }

  return `${TELEGRAM_API_BASE}/file/bot${token}/${filePath}`
}

export const stripImageExtension = (id: string) =>
  id.replace(/\.(?:jpe?g|png|webp)$/i, '')

const requestTelegram = async <T>(
  method: string,
  body: Record<string, unknown>,
): Promise<T | null> => {
  const response = await fetch(getTelegramApiUrl(method), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    next: { revalidate: TELEGRAM_REVALIDATE_SECONDS },
  })

  if (!response.ok) {
    return null
  }

  const data = (await response.json()) as TelegramResponse<T>

  return data.ok ? (data.result ?? null) : null
}

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
