import React from 'react'

import { ChatInfo as ChatInfoComponent } from '../src/components'
import { Chat } from '../src/types'

export default {
  title: 'Chat Info',
}

export const ChatInfo = () => {
  const chatInfo = {
    description: 'The kaboldest camp',
    id: -1001111472139,
    photoUrl: 'https://chat-profile-images.s3.amazonaws.com/file_70280.jpg',
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
