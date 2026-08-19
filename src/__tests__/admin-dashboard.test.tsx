import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import type {
  AdminChatPatch,
  AdminChatsResponse,
  AdminChatUpdateResult,
} from '@/lib/admin-types'

const refreshMock = jest.fn()
const replaceMock = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => '/admin',
  useRouter: () => ({ refresh: refreshMock, replace: replaceMock }),
  useSearchParams: () => new URLSearchParams(),
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
  pagination: { page: 1, pageSize: 20, total: 2, totalPages: 1 },
  summary: { total: 2, allowed: 1, enabled: 1 },
  query: {
    page: 1,
    pageSize: 20,
    q: '',
    aiAccess: 'all',
    sort: 'lastActivityAt',
    direction: 'desc',
  },
}

describe('admin dashboard', () => {
  beforeEach(() => {
    refreshMock.mockReset()
    replaceMock.mockReset()
  })

  test('debounces search into the server-backed URL query', async () => {
    jest.useFakeTimers()
    render(<AdminDashboard initialData={initialData} updateChat={jest.fn()} />)

    fireEvent.change(
      screen.getByRole('searchbox', {
        name: /search chats by name, username or id/i,
      }),
      { target: { value: '@alpha_chat' } },
    )
    expect(replaceMock).not.toHaveBeenCalled()

    await act(async () => {
      jest.advanceTimersByTime(300)
    })

    expect(replaceMock).toHaveBeenCalledWith('/admin?q=%40alpha_chat')
    jest.useRealTimers()
  })

  test('sends AI filters, sortable columns, and pagination to the URL', () => {
    const pagedData: AdminChatsResponse = {
      ...initialData,
      pagination: { page: 1, pageSize: 20, total: 30, totalPages: 2 },
      summary: { ...initialData.summary, total: 30 },
    }
    render(<AdminDashboard initialData={pagedData} updateChat={jest.fn()} />)

    fireEvent.change(
      screen.getByRole('combobox', { name: 'Filter AI access' }),
      {
        target: { value: 'allowed' },
      },
    )
    expect(replaceMock).toHaveBeenLastCalledWith('/admin?aiAccess=allowed')

    fireEvent.click(screen.getByRole('button', { name: /^chat$/i }))
    expect(replaceMock).toHaveBeenLastCalledWith(
      '/admin?sort=name&direction=asc',
    )

    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(replaceMock).toHaveBeenLastCalledWith('/admin?page=2')
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
    render(<AdminDashboard initialData={initialData} updateChat={updateChat} />)

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
      expect(refreshMock).toHaveBeenCalledTimes(1)
    })
  })

  test('refreshes only after a conflicting failed update', async () => {
    const updateChat = jest
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        error: 'Validation failed.',
      } satisfies AdminChatUpdateResult)
      .mockResolvedValueOnce({
        ok: false,
        error: 'Chat configuration changed.',
        conflict: true,
      } satisfies AdminChatUpdateResult)
    render(<AdminDashboard initialData={initialData} updateChat={updateChat} />)

    fireEvent.click(
      screen.getByRole('switch', { name: 'Allow AI for Alpha room' }),
    )
    await screen.findByText('Validation failed.')
    expect(refreshMock).not.toHaveBeenCalled()

    fireEvent.click(
      screen.getByRole('switch', { name: 'Allow AI for Alpha room' }),
    )
    await screen.findByText('Chat configuration changed.')
    expect(refreshMock).toHaveBeenCalledTimes(1)
  })
})
