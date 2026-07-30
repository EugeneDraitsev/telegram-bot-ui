import { act, renderHook } from '@testing-library/react'

import { useChatData } from '../use-chat-data.hook'

class MockWebSocket {
  static instances: MockWebSocket[] = []

  readonly send = jest.fn()
  readonly close = jest.fn()
  onopen: (() => void) | null = null
  onmessage: ((event: { data: string }) => void) | null = null
  onerror: (() => void) | null = null

  constructor(readonly url: string) {
    MockWebSocket.instances.push(this)
  }
}

const originalWebSocket = globalThis.WebSocket
const originalWindowWebSocket = window.WebSocket

beforeEach(() => {
  MockWebSocket.instances = []
  globalThis.WebSocket = MockWebSocket as unknown as typeof WebSocket
  window.WebSocket = MockWebSocket as unknown as typeof WebSocket
})

afterAll(() => {
  globalThis.WebSocket = originalWebSocket
  window.WebSocket = originalWindowWebSocket
})

test('requires a signed access token before opening a socket', () => {
  const { result } = renderHook(() => useChatData('123'))

  expect(result.current.loading).toBe(false)
  expect(result.current.error).toContain('missing access')
  expect(MockWebSocket.instances).toHaveLength(0)
})

test('authenticates the socket and accepts a valid statistics snapshot', () => {
  const { result } = renderHook(() => useChatData('123', 'signed-token'))
  const socket = MockWebSocket.instances[0]

  act(() => socket.onopen?.())
  expect(socket.send).toHaveBeenCalledWith(
    JSON.stringify({
      action: 'stats',
      chatId: '123',
      accessToken: 'signed-token',
    }),
  )

  act(() =>
    socket.onmessage?.({
      data: JSON.stringify({
        chatInfo: { id: 123, type: 'group', title: 'Test chat' },
        usersData: [{ id: 7, messages: 2 }],
        historicalData: [{ id: 7, username: 'alice', msgCount: 4 }],
      }),
    }),
  )

  expect(result.current).toMatchObject({
    loading: false,
    error: '',
    data: {
      chatInfo: { id: 123, type: 'group', title: 'Test chat' },
      usersData: [{ id: 7, messages: 2 }],
      historicalData: [{ id: 7, username: 'alice', msgCount: 4 }],
    },
  })
})

test('closes the socket when the consumer unmounts', () => {
  const { unmount } = renderHook(() => useChatData('123', 'signed-token'))
  const socket = MockWebSocket.instances[0]

  unmount()

  expect(socket.close).toHaveBeenCalledTimes(1)
})
