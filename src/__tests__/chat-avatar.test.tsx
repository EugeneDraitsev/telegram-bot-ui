import { render, screen } from '@testing-library/react'

import { ChatAvatar, getChatPhotoUrl } from '@/components/chat-avatar.component'

describe('chat avatar', () => {
  test('renders the chat photo through the chat-scoped image route', () => {
    const { container } = render(
      <ChatAvatar chatId="-1001534923737" name="Зубач" hasPhoto />,
    )

    const image = container.querySelector('img')
    expect(image).toHaveAttribute('src', '/chat/image/-1001534923737')
    expect(image).toHaveAttribute('loading', 'lazy')
    expect(screen.queryByText('З')).not.toBeInTheDocument()
  })

  test('falls back to initials when the chat has no photo', () => {
    const { container } = render(
      <ChatAvatar chatId="-1001" name="Alpha room" />,
    )

    expect(container.querySelector('img')).toBeNull()
    expect(screen.getByText('AR')).toBeInTheDocument()
  })

  test('keeps the same colour for the same chat name', () => {
    const first = render(<ChatAvatar chatId="-1" name="Alpha room" />)
    const second = render(<ChatAvatar chatId="-2" name="Alpha room" />)
    const color = (result: { container: HTMLElement }) =>
      result.container.querySelector('span')?.style.background

    expect(color(first)).toBe(color(second))
    expect(color(first)).toBeTruthy()
  })

  test('never points at a raw Telegram file id', () => {
    expect(getChatPhotoUrl('-1001534923737')).toBe(
      '/chat/image/-1001534923737',
    )
  })
})
