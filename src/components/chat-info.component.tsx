import { Chat } from '@/types'
import { getChatName } from '@/utils'

interface ChatInfoProps {
  data: Chat
  className?: string
}

export const ChatInfo = ({ data, className }: ChatInfoProps) => (
  <div className={`flex justify-center w-full bg-neutral-300 ${className}`}>
    <div className="flex items-center w-full max-w-[1200px] text-left py-1 px-4">
      <div
        className="w-[70px] h-[70px] bg-contain rounded-full border-2 border-white"
        style={{
          backgroundImage: `url(${
            data?.photo?.big_file_id
              ? `/chat/image/${data?.photo?.big_file_id}`
              : '/favicon.png'
          })`,
        }}
      />
      <div className="ml-5">
        <div className="text-2xl font-light leading-none">
          {getChatName(data)}
        </div>
        <div className="text-sm">{data?.description}</div>
      </div>
    </div>
  </div>
)
