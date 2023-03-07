import type { ReactNode } from 'react'
import { cache } from 'react'

import { ChatInfo } from '@/components'
import { BASE_TG_URL } from '@/constants'

const getChatInfo = cache(async (chatId: string) => {
  const chat = await fetch(`${BASE_TG_URL}/getChat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId }),
    next: { revalidate: 30 }, // 30 sec revalidation
  }).then((r) => r.json())

  return chat.result
})

interface ChatLayoutParams {
  params: { id: string }
}

interface ChatLayoutProps extends ChatLayoutParams {
  children: ReactNode
}

export async function generateMetadata({ params }: ChatLayoutParams) {
  const chatInfo = await getChatInfo(params.id)
  const title = 'Telegram Bot Stats'
  const description = `${chatInfo?.title} Statistics for the last 24 hours`
  const imageUrl = chatInfo?.photo?.small_file_id
    ? `/chat/image/${chatInfo?.photo?.small_file_id}.jpg`
    : '/favicon.png'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      images: [imageUrl],
    },
  }
}

export default async function ChatLayout({
  children,
  params,
}: ChatLayoutProps) {
  const chatInfo = await getChatInfo(params.id)

  return (
    <>
      <ChatInfo data={chatInfo} />
      {children}
    </>
  )
}

export async function generateStaticParams() {
  // TODO: fetch 100 last active chats
  const chats = ['-1001306676509']

  return chats.map((chatId) => ({
    id: chatId,
  }))
}
