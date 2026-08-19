jest.mock('server-only', () => ({}))

export {}

const { getSafeBackUrl } = await import('@/lib/admin-session')

describe('safe login return URLs', () => {
  test.each([
    ['https://evil.example', '/'],
    ['//evil.example', '/'],
    ['/\\evil.example', '/'],
    ['/chat/-1\r\nLocation: https://evil.example', '/'],
    ['/chat/-1001?tab=day', '/chat/-1001?tab=day'],
  ])('normalizes %p to %p', (value, expected) => {
    expect(getSafeBackUrl(value)).toBe(expected)
  })
})
