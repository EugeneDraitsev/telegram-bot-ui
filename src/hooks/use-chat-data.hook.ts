import { useEffect, useState } from 'react'
import { isEmpty, noop } from 'lodash-es'

import { safeParse } from '@/utils'
import { CONFIG } from '@/constants'
import type { Chat, DailyUserData, HistoricalData } from '@/types'

export type ChatData = {
  chatInfo?: Chat
  usersData: DailyUserData[]
  historicalData?: HistoricalData[]
}

const MISSING_ACCESS_ERROR =
  'This statistics link is missing access. Run /s in the Telegram chat to get a fresh link.'

export const useChatData = (
  chatId: string | number,
  accessToken?: string,
) => {
  const [data, setChatData] = useState<ChatData>({} as ChatData)
  const [loading, setLoading] = useState(Boolean(accessToken))
  const [error, setError] = useState(
    accessToken ? '' : MISSING_ACCESS_ERROR,
  )

  useEffect(() => {
    if (!accessToken) {
      return noop
    }

    if (chatId) {
      const socket = new WebSocket(CONFIG.wss)
      socket.onopen = () => {
        socket.send(JSON.stringify({ action: 'stats', chatId, accessToken }))
      }
      socket.onmessage = (event) => {
        const newData = safeParse(event.data)
        setLoading(false)

        if (newData?.error) {
          return setError(newData.error)
        }

        if (!isEmpty(newData)) {
          return setChatData(({ usersData }) => ({
            chatInfo: newData.chatInfo,
            usersData: newData.usersData || usersData,
            historicalData: newData.historicalData,
          }))
        }

        return setError(
          `Seems like we don't have any events for this chat (${chatId}) for last 24h`,
        )
      }
      socket.onerror = () => {
        setLoading(false)
        setError('Could not connect to statistics. Try again later.')
      }
      return () => socket.close()
    }
    return noop
  }, [accessToken, chatId])

  return { data, loading, error }
}
