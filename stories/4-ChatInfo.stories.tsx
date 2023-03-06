import { ChatInfo as ChatInfoComponent } from '@/components'
import { Chat } from '@/types'

export default {
  title: 'Chat Info',
}

export const ChatInfo = () => {
  const chatInfo = {
    description: 'The kaboldest camp',
    id: -1001111472139,
    title: 'Kabold сamp',
    type: 'supergroup',
  }
  return (
    <>
      <ChatInfoComponent data={chatInfo as Chat} />
    </>
  )
}

export const EdgeCaseChatInfo = () => {
  const chatInfo = {}
  return (
    <>
      <ChatInfoComponent data={chatInfo as Chat} />
    </>
  )
}
