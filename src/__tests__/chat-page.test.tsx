import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'

import ChatPage from '../app/chat/[id]/page'
import { ThemeProvider } from '../contexts'

import * as hooks from '../hooks/use-chat-data.hook'

const useChatDataMock = jest.spyOn(hooks, 'useChatData')

beforeEach(() => {
  useChatDataMock.mockReset()
})

afterAll(() => {
  useChatDataMock.mockRestore()
})

describe('Chat Page', () => {
  it('shows the correct children and calls useChatData with correct arguments', async () => {
    useChatDataMock.mockReturnValue({
      data: {
        usersData: [
          { id: 1, username: 'user1', messages: 62, is_bot: false },
          { id: 2, username: 'user2', messages: 52, is_bot: false },
          { id: 3, username: 'user3', messages: 30, is_bot: false },
          { id: 4, username: 'user4', messages: 27, is_bot: false },
          { id: 5, username: 'user5', messages: 16, is_bot: false },
          { id: 6, username: 'user6', messages: 10, is_bot: false },
          { id: 7, username: 'user7', messages: 9, is_bot: false },
          { id: 8, username: 'user8', messages: 5, is_bot: false },
          { id: 9, username: 'user9', messages: 3, is_bot: false },
        ],
      },
      loading: false,
      error: '',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })
    const searchParams = Promise.resolve({ access: 'test-access-token' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} searchParams={searchParams} />
        </ThemeProvider>,
      )
      // Important: let the suspended promise settle INSIDE act
      await params
      await searchParams
    })

    expect(hooks.useChatData).toHaveBeenCalledWith(
      'test-chat-id',
      'test-access-token',
    )

    // Use find* to wait for the post-suspense UI
    expect(await screen.findAllByText('Barchart')).toHaveLength(2)
    expect(await screen.findByText('Piechart')).toBeInTheDocument()
  })

  it('shows spinner while loading', async () => {
    useChatDataMock.mockReturnValue({
      data: { usersData: [] },
      loading: true,
      error: '',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })
    const searchParams = Promise.resolve({ access: 'test-access-token' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} searchParams={searchParams} />
        </ThemeProvider>,
      )
      await params
      await searchParams
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
    useChatDataMock.mockReturnValue({
      data: { usersData: [] },
      loading: false,
      error: 'Something Went Wrong',
    })

    const params = Promise.resolve({ id: 'test-chat-id' })
    const searchParams = Promise.resolve({ access: 'test-access-token' })

    await act(async () => {
      render(
        <ThemeProvider>
          <ChatPage params={params} searchParams={searchParams} />
        </ThemeProvider>,
      )
      await params
      await searchParams
    })

    expect(await screen.findByText('Something Went Wrong')).toBeInTheDocument()
  })
})
