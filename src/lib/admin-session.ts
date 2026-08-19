import 'server-only'

import { cookies } from 'next/headers'

export const ADMIN_SESSION_COOKIE = 'telegram_admin_session'
export const OIDC_STATE_COOKIE = 'telegram_admin_oidc_state'
export const OIDC_VERIFIER_COOKIE = 'telegram_admin_oidc_verifier'
export const OIDC_NONCE_COOKIE = 'telegram_admin_oidc_nonce'

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/admin',
}

export async function getAdminSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(ADMIN_SESSION_COOKIE)?.value
}
