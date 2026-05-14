import { cache } from 'react'

import type { ReactNode } from 'react'
import type { Metadata } from 'next'

import { ChatInfo } from '@/components'
import { getTelegramChat } from '@/lib/telegram'
import { getChatName } from '@/utils'

export const dynamic = 'force-dynamic'

const getChatInfo = cache((chatId: string) => getTelegramChat(chatId))

interface ChatLayoutParams {
  params: Promise<{ id: string }>
}

interface ChatLayoutProps extends ChatLayoutParams {
  children: ReactNode
}

export async function generateMetadata({ params }: ChatLayoutParams) {
  const { id } = await params
  const chatInfo = await getChatInfo(id)
  const title = 'Telegram Bot Stats'
  const chatName = getChatName(chatInfo)
  const description = `${chatName} statistics for the last 24 hours`
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
  } as Metadata
}

export default async function ChatLayout({
  children,
  params,
}: ChatLayoutProps) {
  const { id } = await params
  const chatInfo = await getChatInfo(id)

  return (
    <>
      <ChatInfo data={chatInfo} />
      {children}
    </>
  )
}
