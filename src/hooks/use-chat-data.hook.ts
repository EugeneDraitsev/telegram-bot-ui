import { useEffect, useState } from 'react'

import { safeParse } from '@/utils'
import { CONFIG } from '@/constants'
import type { Chat, DailyUserData, HistoricalData } from '@/types'

export type ChatData = {
  chatInfo?: Chat
  usersData: DailyUserData[]
  historicalData?: HistoricalData[]
}

type ChatDataMessage = Partial<ChatData> & { error?: unknown }

const MISSING_ACCESS_ERROR =
  'This statistics link is missing access. Run /s in the Telegram chat to get a fresh link.'

export const useChatData = (
  chatId: string | number,
  accessToken?: string,
) => {
  const [data, setChatData] = useState<ChatData>({ usersData: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!accessToken) {
      return
    }

    let disposed = false
    let socket: WebSocket
    try {
      socket = new WebSocket(CONFIG.wss)
    } catch {
      queueMicrotask(() => {
        if (!disposed) {
          setLoading(false)
          setError('Could not connect to statistics. Try again later.')
        }
      })
      return () => {
        disposed = true
      }
    }

    socket.onopen = () => {
      setLoading(true)
      setError('')
      socket.send(JSON.stringify({ action: 'stats', chatId, accessToken }))
    }
    socket.onmessage = (event) => {
      if (disposed) {
        return
      }

      const newData =
        typeof event.data === 'string' ? safeParse(event.data) : null
      setLoading(false)

      if (!newData || typeof newData !== 'object' || Array.isArray(newData)) {
        setError('Statistics service returned an invalid response.')
        return
      }

      const message = newData as ChatDataMessage
      if (typeof message.error === 'string') {
        setError(message.error)
        return
      }

      const usersData = Array.isArray(message.usersData)
        ? message.usersData
        : undefined
      const historicalData = Array.isArray(message.historicalData)
        ? message.historicalData
        : undefined
      if (!message.chatInfo && !usersData && !historicalData) {
        setError(
          `Seems like we don't have any events for this chat (${chatId}) for last 24h`,
        )
        return
      }

      setError('')
      setChatData((current) => ({
        chatInfo: message.chatInfo ?? current.chatInfo,
        usersData: usersData ?? current.usersData,
        historicalData: historicalData ?? current.historicalData,
      }))
    }
    socket.onerror = () => {
      if (!disposed) {
        setLoading(false)
        setError('Could not connect to statistics. Try again later.')
      }
    }

    return () => {
      disposed = true
      socket.close()
    }
  }, [accessToken, chatId])

  return {
    data,
    loading: accessToken ? loading : false,
    error: accessToken ? error : MISSING_ACCESS_ERROR,
  }
}
