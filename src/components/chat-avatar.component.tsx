import type { CSSProperties } from 'react'

interface ChatAvatarProps {
  chatId: string
  name: string
  hasPhoto?: boolean
  size?: number
  className?: string
}

// Telegram-ish accent colours for chats without a photo.
const PALETTE = [
  '#e17076',
  '#7bc862',
  '#65aadd',
  '#a695e7',
  '#ee7aae',
  '#6ec9cb',
  '#faa774',
]

const getInitials = (name: string): string =>
  name
    .replace(/^@/, '')
    .split(/[\s_.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => [...word][0])
    .join('')
    .toUpperCase() || '#'

export const getChatPhotoUrl = (chatId: string): string =>
  `/chat/image/${encodeURIComponent(chatId)}`

const getColor = (seed: string): string => {
  let hash = 0
  for (const char of seed) hash = (hash * 31 + char.codePointAt(0)!) >>> 0
  return PALETTE[hash % PALETTE.length]
}

export const ChatAvatar = ({
  chatId,
  name,
  hasPhoto,
  size = 70,
  className,
}: ChatAvatarProps) => {
  const shape: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    borderRadius: '50%',
    border: '2px solid #fff',
    boxSizing: 'border-box',
  }

  // A plain img rather than next/image: the source is our own session-gated
  // route, and the Next image optimizer would fetch it without the user cookie.
  if (hasPhoto) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getChatPhotoUrl(chatId)}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ ...shape, objectFit: 'cover', background: getColor(name) }}
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        ...shape,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: getColor(name),
        color: '#fff',
        fontSize: Math.round(size * 0.36),
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {getInitials(name)}
    </span>
  )
}
