import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import type {
  AdminChatPatch,
  AdminChatsResponse,
  AdminChatUpdateResult,
} from '@/lib/admin-types'

const refreshMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: refreshMock }),
}))

const { AdminDashboard } = await import('../app/admin/admin-dashboard')

const initialData: AdminChatsResponse = {
  admin: { id: '42', name: 'Owner' },
  chats: [
    {
      chatId: '-1001',
      name: 'Alpha room',
      username: 'alpha_chat',
      type: 'supergroup',
      aiAllowed: false,
      agenticEnabled: false,
      configured: true,
      version: 2,
      lastActivityAt: 2_000,
    },
    {
      chatId: '-1002',
      name: 'Beta room',
      type: 'group',
      aiAllowed: true,
      agenticEnabled: true,
      configured: true,
      version: 4,
      lastActivityAt: 1_000,
    },
  ],
}

describe('admin dashboard', () => {
  beforeEach(() => {
    refreshMock.mockReset()
  })

  test('searches chats by username and ID', async () => {
    render(
      <AdminDashboard
        initialData={initialData}
        updateChat={jest.fn()}
      />,
    )

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: /search chats by name, username or id/i,
      }),
      { target: { value: '@alpha_chat' } },
    )

    await waitFor(() => {
      expect(screen.getByText('Alpha room')).toBeInTheDocument()
      expect(screen.queryByText('Beta room')).not.toBeInTheDocument()
    })

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: /search chats by name, username or id/i,
      }),
      { target: { value: '-1002' } },
    )

    await waitFor(() => {
      expect(screen.getByText('Beta room')).toBeInTheDocument()
      expect(screen.queryByText('Alpha room')).not.toBeInTheDocument()
    })
  })

  test('sends an explicit versioned allowlist update', async () => {
    const updateChat = jest.fn(
      async (input: AdminChatPatch): Promise<AdminChatUpdateResult> => ({
        ok: true,
        configuration: {
          chatId: input.chatId,
          aiAllowed: true,
          agenticEnabled: false,
          version: input.version + 1,
        },
      }),
    )
    render(
      <AdminDashboard initialData={initialData} updateChat={updateChat} />,
    )

    fireEvent.click(
      screen.getByRole('switch', { name: 'Allow AI for Alpha room' }),
    )

    await waitFor(() => {
      expect(updateChat).toHaveBeenCalledWith({
        chatId: '-1001',
        version: 2,
        aiAllowed: true,
      })
      expect(
        screen.getByRole('switch', { name: 'Disallow AI for Alpha room' }),
      ).toBeChecked()
    })
  })

  test('refreshes and adopts server state after a conflicting update', async () => {
    const updateChat = jest.fn(
      async (): Promise<AdminChatUpdateResult> => ({
        ok: false,
        error: 'Chat configuration changed. Refresh and try again.',
      }),
    )
    const { rerender } = render(
      <AdminDashboard initialData={initialData} updateChat={updateChat} />,
    )

    fireEvent.click(
      screen.getByRole('switch', { name: 'Allow AI for Alpha room' }),
    )

    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1)
      expect(
        screen.getByText('Chat configuration changed. Refresh and try again.'),
      ).toBeInTheDocument()
    })

    const refreshedData: AdminChatsResponse = {
      ...initialData,
      chats: initialData.chats.map((chat) =>
        chat.chatId === '-1001'
          ? { ...chat, aiAllowed: true, version: 3 }
          : chat,
      ),
    }
    rerender(
      <AdminDashboard initialData={refreshedData} updateChat={updateChat} />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('switch', { name: 'Disallow AI for Alpha room' }),
      ).toBeChecked()
      expect(screen.getByText('Config v3')).toBeInTheDocument()
    })
  })
})
