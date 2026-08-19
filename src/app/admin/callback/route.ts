import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { AdminApiError, createAdminSession } from '@/lib/admin-api'
import { getTelegramOidcConfiguration } from '@/lib/admin-config'
import {
  ADMIN_SESSION_COOKIE,
  OIDC_NONCE_COOKIE,
  OIDC_STATE_COOKIE,
  OIDC_VERIFIER_COOKIE,
  adminCookieOptions,
} from '@/lib/admin-session'

export const runtime = 'nodejs'

interface TelegramTokenResponse {
  id_token?: unknown
}

function clearOidcCookies(response: NextResponse): void {
  for (const name of [
    OIDC_STATE_COOKIE,
    OIDC_NONCE_COOKIE,
    OIDC_VERIFIER_COOKIE,
  ]) {
    response.cookies.set(name, '', { ...adminCookieOptions, maxAge: 0 })
  }
}

function errorRedirect(request: NextRequest, code: string): NextResponse {
  const url = new URL('/admin/sign-in', request.url)
  url.searchParams.set('error', code)
  const response = NextResponse.redirect(url)
  clearOidcCookies(response)
  return response
}

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.has('error')) {
    return errorRedirect(request, 'telegram_rejected')
  }

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const expectedState = request.cookies.get(OIDC_STATE_COOKIE)?.value
  const nonce = request.cookies.get(OIDC_NONCE_COOKIE)?.value
  const verifier = request.cookies.get(OIDC_VERIFIER_COOKIE)?.value
  if (!code || !state || state !== expectedState || !nonce || !verifier) {
    return errorRedirect(request, 'invalid_state')
  }

  try {
    const { clientId, clientSecret, redirectUri } =
      getTelegramOidcConfiguration()
    const tokenResponse = await fetch('https://oauth.telegram.org/token', {
      method: 'POST',
      cache: 'no-store',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: verifier,
      }),
    })

    const tokens = (await tokenResponse.json().catch(() => ({}))) as
      | TelegramTokenResponse
      | undefined
    if (!tokenResponse.ok || typeof tokens?.id_token !== 'string') {
      return errorRedirect(request, 'token_exchange_failed')
    }

    const session = await createAdminSession(tokens.id_token, nonce)
    const response = NextResponse.redirect(new URL('/admin', request.url))
    response.cookies.set(ADMIN_SESSION_COOKIE, session.token, {
      ...adminCookieOptions,
      maxAge: session.expiresIn,
    })
    clearOidcCookies(response)
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 403) {
      return errorRedirect(request, 'not_allowed')
    }
    return errorRedirect(request, 'login_failed')
  }
}
