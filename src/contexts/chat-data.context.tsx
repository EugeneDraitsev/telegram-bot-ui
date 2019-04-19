import React, { memo, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { safeParse } from '../utils'
import { UserData } from '../types'

interface ChatDataProviderProps extends RouteComponentProps {
  children: JSX.Element | JSX.Element []
}

interface ChatDataState {
  data: UserData [],
  loading: boolean
  error: string
}

const ChatDataContext = React.createContext({} as ChatDataState)

const ChatDataProvider = memo(withRouter<ChatDataProviderProps>(({ children, history }: ChatDataProviderProps) => {
  const { location: { pathname } } = history
  const [data, setChatData] = useState<UserData []>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    const socket = new WebSocket('wss://97cq41uoj7.execute-api.eu-central-1.amazonaws.com/prod')
    const chatId = pathname.replace('/', '')
    socket.onopen = () => {
      socket.send(JSON.stringify({ action: 'stats', chatId }))
    }
    socket.onmessage = (event) => {
      const newData = safeParse(event.data)
      setLoading(false)
      if (newData && newData.length) {
        return setChatData(newData)
      }
      return setError(`Seems like we don't have any events for this chat (${chatId}) for last 24h`)
    }
    return () => socket.close()
  }, [pathname, setLoading, setError])

  return (
    <ChatDataContext.Provider value={{ data, loading, error }}>
      {children}
    </ChatDataContext.Provider>
  )
}))

const ChatDataConsumer = ChatDataContext.Consumer

export { ChatDataContext, ChatDataProvider, ChatDataConsumer }
