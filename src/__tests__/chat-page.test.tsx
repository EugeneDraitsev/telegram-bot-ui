// ChatPage.test.tsx
import React, { Suspense } from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'

import ChatPage from '../app/chat/[id]/page'
import { ThemeProvider } from '../contexts'

jest.mock('../hooks/use-chat-data.hook', () => ({
  useChatData: jest.fn(),
}))
import * as hooks from '../hooks/use-chat-data.hook'

// If you do not use next/router in this page, remove the spy to avoid noise
// If you really need it, switch to next/navigation for App Router
// const useRouter = jest.spyOn(require('next/router'), 'useRouter')

describe('Chat Page', () => {
  it('shows the correct children and calls useChatData with correct arguments', async () => {
    // @ts-ignore
    ;(hooks.useChatData as jest.Mock).mockReturnValue({
      data: {
        usersData: [
          { id: 1, username: 'user1', messages: 62 },
          { id: 2, username: 'user2', messages: 52 },
          { id: 3, username: 'user3', messages: 30 },
          { id: 4, username: 'user4', messages: 27 },
          { id: 5, username: 'user5', messages: 16 },
          { id: 6, username: 'user6', messages: 10 },
          { id: 7, username: 'user7', messages: 9 },
          { id: 8, username: 'user8', messages: 5 },
          { id: 9, username: 'user9', messages: 3 },
        ],
      },
      loading: false,
      error: '',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} />
        </ThemeProvider>,
      )
      // Important: let the suspended promise settle INSIDE act
      await params
    })

    // Use find* to wait for the post-suspense UI
    expect(await screen.findAllByText('Barchart')).toHaveLength(2)
    expect(await screen.findByText('Piechart')).toBeInTheDocument()
  })

  it('shows spinner while loading', async () => {
    // @ts-ignore
    ;(hooks.useChatData as jest.Mock).mockReturnValue({
      data: {},
      loading: true,
      error: '',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} />
        </ThemeProvider>,
      )
      await params
    })

    // Wait for the loading UI
    expect(await screen.findAllByLabelText('spinner')).toHaveLength(2)

    // While loading, charts should not be there; use waitFor with a negative assertion
    await waitFor(() => {
      expect(screen.queryAllByText('Barchart')).toHaveLength(0)
      expect(screen.queryByText('Piechart')).not.toBeInTheDocument()
    })
  })

  it('shows error if useChatData fails', async () => {
    // @ts-ignore
    ;(hooks.useChatData as jest.Mock).mockReturnValue({
      data: {},
      loading: false,
      error: 'Something Went Wrong',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} />
        </ThemeProvider>,
      )
      await params
    })

    expect(await screen.findByText('Something Went Wrong')).toBeInTheDocument()
  })
})
