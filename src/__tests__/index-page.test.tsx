import { render, screen } from '@testing-library/react'

jest.mock('server-only', () => ({}))

const { SignedOutHome, UserHome } = await import('../app/page')

describe('Index Page', () => {
  test('offers Telegram login without exposing public chat search', () => {
    render(<SignedOutHome />)

    expect(
      screen.getByText('Your chats, without public links.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Continue with Telegram' }),
    ).toHaveAttribute('href', '/login?backUrl=%2F')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  test('shows only the signed-in user chat list and owner controls', () => {
    render(
      <UserHome
        data={{
          user: { id: '42', name: 'Owner', isAdmin: true },
          chats: [
            {
              chatId: '-1001',
              name: 'Alpha room',
              type: 'supergroup',
              lastActivityAt: 2_000,
              messageCount: 12,
            },
          ],
        }}
      />,
    )

    expect(screen.getByRole('link', { name: /Alpha room/ })).toHaveAttribute(
      'href',
      '/chat/-1001',
    )
    expect(screen.getByRole('link', { name: 'Control room' })).toHaveAttribute(
      'href',
      '/admin',
    )
  })
})
