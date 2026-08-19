import { createHash, randomBytes } from 'node:crypto'

import { NextResponse } from 'next/server'

import { getTelegramOidcConfiguration } from '@/lib/admin-config'
import {
  OIDC_NONCE_COOKIE,
  OIDC_STATE_COOKIE,
  OIDC_VERIFIER_COOKIE,
  adminCookieOptions,
} from '@/lib/admin-session'

export const runtime = 'nodejs'

function randomBase64Url(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}

export function GET() {
  const { clientId, redirectUri } = getTelegramOidcConfiguration()
  const state = randomBase64Url()
  const nonce = randomBase64Url()
  const verifier = randomBase64Url(48)
  const challenge = createHash('sha256')
    .update(verifier)
    .digest('base64url')

  const authorizationUrl = new URL('https://oauth.telegram.org/auth')
  authorizationUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile',
    state,
    nonce,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  }).toString()

  const response = NextResponse.redirect(authorizationUrl)
  const options = { ...adminCookieOptions, maxAge: 10 * 60 }
  response.cookies.set(OIDC_STATE_COOKIE, state, options)
  response.cookies.set(OIDC_NONCE_COOKIE, nonce, options)
  response.cookies.set(OIDC_VERIFIER_COOKIE, verifier, options)
  response.headers.set('Cache-Control', 'no-store')
  return response
}
