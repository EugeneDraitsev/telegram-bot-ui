import { render, screen } from '@testing-library/react'

import { ThemeProvider } from '../contexts'
import * as hooks from '../hooks/use-chat-data.hook'

jest.mock('server-only', () => ({}))

const { ChatDashboard } = await import('../app/chat/[id]/chat-dashboard')
const { ChatAccessMessage } = await import('../app/chat/[id]/page')

const useChatDataMock = jest.spyOn(hooks, 'useChatData')

beforeEach(() => {
  useChatDataMock.mockReset()
})

afterAll(() => {
  useChatDataMock.mockRestore()
})

describe('Chat Page', () => {
  test('renders statistics with the resolved access token', async () => {
    useChatDataMock.mockReturnValue({
      data: {
        usersData: [
          { id: 1, username: 'user1', messages: 62, is_bot: false },
          { id: 2, username: 'user2', messages: 52, is_bot: false },
        ],
      },
      loading: false,
      error: '',
    })

    render(
      <ThemeProvider>
        <ChatDashboard chatId="-1001" accessToken="short-lived-token" />
      </ThemeProvider>,
    )

    expect(hooks.useChatData).toHaveBeenCalledWith('-1001', 'short-lived-token')
    expect(await screen.findAllByText('Barchart')).toHaveLength(2)
    expect(await screen.findByText('Piechart')).toBeInTheDocument()
  })

  test('shows a Telegram login that returns to the requested chat', () => {
    render(<ChatAccessMessage chatId="-1001306676509" />)

    expect(screen.getByText('Sign in to continue.')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Continue with Telegram' }),
    ).toHaveAttribute('href', '/login?backUrl=%2Fchat%2F-1001306676509')
  })

  test('shows a clear denial for a chat outside the user list', () => {
    render(<ChatAccessMessage chatId="-1001" denied />)

    expect(
      screen.getByText('This chat is not in your list.'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View your chats' }),
    ).toHaveAttribute('href', '/')
  })
})
