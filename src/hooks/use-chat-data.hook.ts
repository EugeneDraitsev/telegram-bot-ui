import { useEffect, useState } from 'react'
import { isEmpty, noop } from 'lodash-es'

import { safeParse } from '../utils'
import { ChatInfo, UserData } from '../types'

export interface ChatData {
  usersData: UserData[],
  chatInfo: ChatInfo
}

export const useChatData = (chatId: string | number, initialData: ChatData = {} as ChatData) => {
  const [data, setChatData] = useState<ChatData>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (chatId) {
      setLoading(!initialData)
      const socket = new WebSocket('wss://97cq41uoj7.execute-api.eu-central-1.amazonaws.com/prod')
      socket.onopen = () => {
        socket.send(JSON.stringify({ action: 'stats', chatId }))
      }
      socket.onmessage = (event) => {
        const newData = safeParse(event.data)
        setLoading(false)

        if (!isEmpty(newData)) {
          return setChatData(({ usersData, chatInfo }) => ({
            usersData: newData.usersData || usersData,
            chatInfo: newData.chatInfo || chatInfo,
          }))
        }

        return setError(`Seems like we don't have any events for this chat (${chatId}) for last 24h`)
      }
      return () => socket.close()
    }
    return noop
  }, [setLoading, setError, chatId])

  return { data, loading, error }
}
