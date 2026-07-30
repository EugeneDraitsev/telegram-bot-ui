import Image from 'next/image'

import { Chat } from '@/types'
import { getChatName } from '@/utils'

interface ChatInfoProps {
  data?: Chat | null
  className?: string
}

export const ChatInfo = ({ data, className }: ChatInfoProps) => (
  <div
    className={['flex justify-center w-full bg-neutral-300', className]
      .filter(Boolean)
      .join(' ')}
  >
    <div className="flex items-center w-full max-w-[1200px] text-left py-1 px-4">
      <Image
        src="/favicon.png"
        alt=""
        width={70}
        height={70}
        className="rounded-full border-2 border-white"
      />
      <div className="ml-5">
        <h1 className="text-2xl font-light leading-none">
          {getChatName(data)}
        </h1>
        <p className="text-sm">{data?.description}</p>
      </div>
    </div>
  </div>
)
