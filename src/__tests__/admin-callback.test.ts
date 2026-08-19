import type { NextRequest } from 'next/server'

jest.mock('server-only', () => ({}))

const adminApi = await import('@/lib/admin-api')
const adminConfig = await import('@/lib/admin-config')
const {
  OIDC_BACK_URL_COOKIE,
  OIDC_NONCE_COOKIE,
  OIDC_STATE_COOKIE,
  OIDC_VERIFIER_COOKIE,
  SESSION_COOKIE,
} = await import('@/lib/admin-session')

const createSessionMock = jest.spyOn(adminApi, 'createSession')
const fetchMock = jest.fn()
const getTelegramOidcConfigurationMock = jest.spyOn(
  adminConfig,
  'getTelegramOidcConfiguration',
)
const originalFetch = globalThis.fetch
globalThis.fetch = fetchMock as typeof fetch

const { GET } = await import('../app/admin/callback/route')

function callbackRequest(
  query: string,
  cookies: Record<string, string> = {},
): NextRequest {
  const url = `https://telegram-bot-ui.vercel.app/admin/callback${query}`
  return {
    url,
    nextUrl: new URL(url),
    cookies: {
      get: (name: string) =>
        cookies[name] === undefined
          ? undefined
          : { name, value: cookies[name] },
    },
  } as unknown as NextRequest
}

describe('Telegram OIDC callback', () => {
  beforeEach(() => {
    getTelegramOidcConfigurationMock.mockReturnValue({
      clientId: '123456789',
      clientSecret: 'telegram-client-secret',
      redirectUri: 'https://telegram-bot-ui.vercel.app/admin/callback',
    })
  })

  afterEach(() => {
    createSessionMock.mockReset()
    fetchMock.mockReset()
    getTelegramOidcConfigurationMock.mockClear()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
    createSessionMock.mockRestore()
    getTelegramOidcConfigurationMock.mockRestore()
  })

  test('rejects invalid state before requests and preserves a safe back URL', async () => {
    const response = await GET(
      callbackRequest('?code=code&state=wrong', {
        [OIDC_STATE_COOKIE]: 'expected',
        [OIDC_NONCE_COOKIE]: 'nonce',
        [OIDC_VERIFIER_COOKIE]: 'verifier',
        [OIDC_BACK_URL_COOKIE]: '/chat/-1001',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://telegram-bot-ui.vercel.app/sign-in?error=invalid_state&backUrl=%2Fchat%2F-1001',
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(createSessionMock).not.toHaveBeenCalled()
    expect(
      response.cookies
        .getAll()
        .filter(({ name }) =>
          [
            OIDC_STATE_COOKIE,
            OIDC_NONCE_COOKIE,
            OIDC_VERIFIER_COOKIE,
            OIDC_BACK_URL_COOKIE,
          ].includes(name),
        )
        .map(({ name, value }) => ({ name, value })),
    ).toEqual([
      { name: OIDC_STATE_COOKIE, value: '' },
      { name: OIDC_NONCE_COOKIE, value: '' },
      { name: OIDC_VERIFIER_COOKIE, value: '' },
      { name: OIDC_BACK_URL_COOKIE, value: '' },
    ])
  })

  test('exchanges PKCE code, creates a shared session, and returns to the chat', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id_token: 'telegram-id-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    createSessionMock.mockResolvedValue({
      token: 'session-token',
      expiresIn: 43_200,
      user: { id: '42', isAdmin: true },
    })

    const response = await GET(
      callbackRequest('?code=authorization-code&state=expected', {
        [OIDC_STATE_COOKIE]: 'expected',
        [OIDC_NONCE_COOKIE]: 'nonce',
        [OIDC_VERIFIER_COOKIE]: 'verifier',
        [OIDC_BACK_URL_COOKIE]: '/chat/-1001',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://telegram-bot-ui.vercel.app/chat/-1001',
    )
    const [, init] = fetchMock.mock.calls[0]
    expect(new URLSearchParams(String(init?.body)).get('code_verifier')).toBe(
      'verifier',
    )
    expect(createSessionMock).toHaveBeenCalledWith('telegram-id-token', 'nonce')
    expect(response.cookies.get(SESSION_COOKIE)?.value).toBe('session-token')
  })

  test('never redirects to an external back URL', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id_token: 'telegram-id-token' }), {
        status: 200,
      }),
    )
    createSessionMock.mockResolvedValue({
      token: 'session-token',
      expiresIn: 43_200,
      user: { id: '7', isAdmin: false },
    })

    const response = await GET(
      callbackRequest('?code=authorization-code&state=expected', {
        [OIDC_STATE_COOKIE]: 'expected',
        [OIDC_NONCE_COOKIE]: 'nonce',
        [OIDC_VERIFIER_COOKIE]: 'verifier',
        [OIDC_BACK_URL_COOKIE]: '//evil.example/steal',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://telegram-bot-ui.vercel.app/',
    )
  })
})
