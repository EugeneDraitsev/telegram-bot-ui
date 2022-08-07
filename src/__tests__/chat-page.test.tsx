import React from 'react'
import { render, screen } from '@testing-library/react'

import ChatPage from '../pages/chat/[id]'
import { Chat } from '../types'
import { ThemeProvider } from '../contexts'
jest.mock('../hooks/use-chat-data.hook', () => ({
  useChatData: jest.fn(),
}))
import * as hooks from '../hooks/use-chat-data.hook'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

const initialChatInfo = {
  title: 'Test Title',
  description: 'Test Description',
}

describe('Chat Page', () => {
  it('shows the correct children and calls useChatData with correct arguments', () => {
    useRouter.mockImplementationOnce(() => ({
      query: { id: '-1' },
    }))

    // @ts-ignore
    hooks.useChatData.mockReturnValue({
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
        chatInfo: {
          id: -1,
          title: 'Test Title',
          description: 'Test Description',
        },
      },
      loading: false,
      error: '',
    })

    render(
      <ThemeProvider>
        <ChatPage initialChatInfo={initialChatInfo as Chat} />
      </ThemeProvider>,
    )

    expect(screen.queryByText(initialChatInfo.title)).toBeInTheDocument()
    expect(screen.queryByText(initialChatInfo.description)).toBeInTheDocument()
    expect(screen.queryAllByText('Barchart')).toHaveLength(2)
    expect(screen.queryByText('Piechart')).toBeInTheDocument()
  })

  it('shows spinner while loading', () => {
    useRouter.mockImplementationOnce(() => ({
      query: { id: '-1' },
    }))

    // @ts-ignore
    hooks.useChatData.mockImplementationOnce(() => ({ data: {}, loading: true, error: '' }))

    render(
      <ThemeProvider>
        <ChatPage initialChatInfo={initialChatInfo as Chat} />
      </ThemeProvider>,
    )

    expect(screen.queryAllByText('Barchart')).toHaveLength(0)
    expect(screen.queryByText('Piechart')).not.toBeInTheDocument()
    expect(screen.queryAllByLabelText('spinner')).toHaveLength(2)
  })

  it('shows error if useChatData fails', () => {
    useRouter.mockImplementationOnce(() => ({
      query: { id: '-1' },
    }))

    // @ts-ignore
    hooks.useChatData.mockImplementationOnce(() => ({
      data: {},
      loading: false,
      error: 'Something Went Wrong',
    }))

    render(
      <ThemeProvider>
        <ChatPage initialChatInfo={initialChatInfo as Chat} />
      </ThemeProvider>,
    )

    expect(screen.queryByText('Something Went Wrong')).toBeInTheDocument()
  })
})
