import type { NextRequest } from 'next/server'

const ADMIN_SESSION_COOKIE = 'telegram_admin_session'
const OIDC_NONCE_COOKIE = 'telegram_admin_oidc_nonce'
const OIDC_STATE_COOKIE = 'telegram_admin_oidc_state'
const OIDC_VERIFIER_COOKIE = 'telegram_admin_oidc_verifier'

const createAdminSessionMock = jest.fn()
const fetchMock = jest.fn()
const getTelegramOidcConfigurationMock = jest.fn(() => ({
  clientId: '123456789',
  clientSecret: 'telegram-client-secret',
  redirectUri: 'https://telegram-bot-ui.vercel.app/admin/callback',
}))
const originalFetch = globalThis.fetch
globalThis.fetch = fetchMock as typeof fetch

class MockAdminApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

jest.mock('@/lib/admin-api', () => ({
  AdminApiError: MockAdminApiError,
  createAdminSession: createAdminSessionMock,
}))

jest.mock('@/lib/admin-config', () => ({
  getTelegramOidcConfiguration: getTelegramOidcConfigurationMock,
}))

jest.mock('@/lib/admin-session', () => ({
  ADMIN_SESSION_COOKIE,
  OIDC_NONCE_COOKIE,
  OIDC_STATE_COOKIE,
  OIDC_VERIFIER_COOKIE,
  adminCookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/admin',
  },
}))

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
  afterEach(() => {
    createAdminSessionMock.mockReset()
    fetchMock.mockReset()
    getTelegramOidcConfigurationMock.mockClear()
  })

  afterAll(() => {
    globalThis.fetch = originalFetch
  })

  test('rejects invalid callback state before making external requests', async () => {
    const response = await GET(
      callbackRequest('?code=code&state=wrong', {
        [OIDC_STATE_COOKIE]: 'expected',
        [OIDC_NONCE_COOKIE]: 'nonce',
        [OIDC_VERIFIER_COOKIE]: 'verifier',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://telegram-bot-ui.vercel.app/admin/sign-in?error=invalid_state',
    )
    expect(fetchMock).not.toHaveBeenCalled()
    expect(createAdminSessionMock).not.toHaveBeenCalled()
    expect(
      response.cookies
        .getAll()
        .filter(({ name }) =>
          [OIDC_STATE_COOKIE, OIDC_NONCE_COOKIE, OIDC_VERIFIER_COOKIE].includes(
            name,
          ),
        )
        .map(({ name, value }) => ({ name, value })),
    ).toEqual([
      { name: OIDC_STATE_COOKIE, value: '' },
      { name: OIDC_NONCE_COOKIE, value: '' },
      { name: OIDC_VERIFIER_COOKIE, value: '' },
    ])
  })

  test('exchanges a valid code and replaces OIDC cookies with an admin session', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ id_token: 'telegram-id-token' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    createAdminSessionMock.mockResolvedValue({
      token: 'admin-session-token',
      expiresIn: 43_200,
      admin: { id: '42' },
    })

    const response = await GET(
      callbackRequest('?code=authorization-code&state=expected', {
        [OIDC_STATE_COOKIE]: 'expected',
        [OIDC_NONCE_COOKIE]: 'nonce',
        [OIDC_VERIFIER_COOKIE]: 'verifier',
      }),
    )

    expect(response.headers.get('location')).toBe(
      'https://telegram-bot-ui.vercel.app/admin',
    )
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [, init] = fetchMock.mock.calls[0]
    expect(init?.method).toBe('POST')
    expect(new URLSearchParams(String(init?.body)).get('code_verifier')).toBe(
      'verifier',
    )
    expect(createAdminSessionMock).toHaveBeenCalledWith(
      'telegram-id-token',
      'nonce',
    )
    expect(response.cookies.get(ADMIN_SESSION_COOKIE)?.value).toBe(
      'admin-session-token',
    )
    expect(response.cookies.get(OIDC_STATE_COOKIE)?.value).toBe('')
    expect(response.cookies.get(OIDC_NONCE_COOKIE)?.value).toBe('')
    expect(response.cookies.get(OIDC_VERIFIER_COOKIE)?.value).toBe('')
  })
})
