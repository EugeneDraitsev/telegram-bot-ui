import Link from 'next/link'

import { ChatAvatar } from '@/components/chat-avatar.component'
import { Chat } from '@/types'
import { getChatName } from '@/utils'

interface ChatInfoProps {
  data?: Chat | null
  className?: string
  loading?: boolean
  chatId: string
  hasPhoto?: boolean
  memberCount?: number
}

const placeholder = 'bg-neutral-400/50 animate-pulse'

const getSubtitle = (data?: Chat | null, memberCount?: number) => {
  if (typeof memberCount === 'number') {
    return `${memberCount.toLocaleString()} ${memberCount === 1 ? 'member' : 'members'}`
  }
  return data?.description ?? ''
}

export const ChatInfo = ({
  data,
  className,
  loading,
  chatId,
  hasPhoto,
  memberCount,
}: ChatInfoProps) => (
  <header
    className={['flex justify-center w-full bg-neutral-300', className]
      .filter(Boolean)
      .join(' ')}
  >
    <div className="flex items-center justify-between gap-4 w-full max-w-[1200px] text-left py-2 px-4">
      <div className="flex items-center min-w-0">
        {loading ? (
          <div
            className={`shrink-0 w-12 h-12 rounded-full border-2 border-white ${placeholder}`}
          />
        ) : (
          <ChatAvatar
            chatId={chatId}
            name={getChatName(data)}
            hasPhoto={hasPhoto}
            size={48}
          />
        )}
        {/* The placeholder rows are 24px and 16px tall on purpose: they match
            the title and subtitle line boxes below, so the text does not shift
            once the chat data arrives. */}
        <div className="ml-4 min-w-0">
          {loading ? (
            <>
              <div className="h-6 flex items-center">
                <div className={`h-3.5 w-36 rounded ${placeholder}`} />
              </div>
              <div className="h-4 flex items-center">
                <div className={`h-2.5 w-24 rounded ${placeholder}`} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-xl font-light leading-6 truncate">
                {getChatName(data)}
              </h1>
              <p className="text-xs leading-4 text-neutral-600 truncate">
                {getSubtitle(data, memberCount)}
              </p>
            </>
          )}
        </div>
      </div>
      <Link
        href="/"
        className="shrink-0 text-sm font-medium text-sky-800 hover:underline"
      >
        All chats
      </Link>
    </div>
  </header>
)
