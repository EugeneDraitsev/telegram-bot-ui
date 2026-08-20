import Image from 'next/image'
import Link from 'next/link'

import { Chat } from '@/types'
import { getChatName } from '@/utils'

interface ChatInfoProps {
  data?: Chat | null
  className?: string
  loading?: boolean
}

const placeholder = 'bg-neutral-400/50 animate-pulse'

export const ChatInfo = ({ data, className, loading }: ChatInfoProps) => (
  <header
    className={['flex justify-center w-full bg-neutral-300', className]
      .filter(Boolean)
      .join(' ')}
  >
    <div className="flex items-center justify-between gap-4 w-full max-w-[1200px] text-left py-3 px-4">
      <div className="flex items-center min-w-0">
        {loading ? (
          <div
            className={`shrink-0 w-[70px] h-[70px] rounded-full border-2 border-white ${placeholder}`}
          />
        ) : (
          <Image
            src="/favicon.png"
            alt=""
            width={70}
            height={70}
            className="shrink-0 rounded-full border-2 border-white"
          />
        )}
        {/* The two placeholder rows are 24px and 20px tall on purpose: they
            match the title and description line boxes below, so the text does
            not shift once the chat data arrives. */}
        <div className="ml-5 min-w-0">
          {loading ? (
            <>
              <div className="h-6 flex items-center">
                <div className={`h-4 w-40 rounded ${placeholder}`} />
              </div>
              <div className="h-5 flex items-center">
                <div className={`h-3 w-60 rounded ${placeholder}`} />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-light leading-none">
                {getChatName(data)}
              </h1>
              <p className="text-sm">{data?.description}</p>
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
