import 'server-only'

import { cookies } from 'next/headers'

export const SESSION_COOKIE = 'telegram_session'
export const LEGACY_ADMIN_SESSION_COOKIE = 'telegram_admin_session'
export const OIDC_STATE_COOKIE = 'telegram_admin_oidc_state'
export const OIDC_VERIFIER_COOKIE = 'telegram_admin_oidc_verifier'
export const OIDC_NONCE_COOKIE = 'telegram_admin_oidc_nonce'
export const OIDC_BACK_URL_COOKIE = 'telegram_oidc_back_url'

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export function getSafeBackUrl(
  value: string | string[] | null | undefined,
  fallback = '/',
): string {
  const candidate = Array.isArray(value) ? value[0] : value
  if (
    !candidate ||
    candidate.length > 2048 ||
    !candidate.startsWith('/') ||
    candidate.startsWith('//') ||
    candidate.includes('\\') ||
    /[\r\n]/.test(candidate)
  ) {
    return fallback
  }

  try {
    const parsed = new URL(candidate, 'https://telegram-bot.local')
    return parsed.origin === 'https://telegram-bot.local'
      ? `${parsed.pathname}${parsed.search}${parsed.hash}`
      : fallback
  } catch {
    return fallback
  }
}

export async function getSessionToken(): Promise<string | undefined> {
  const store = await cookies()
  return (
    store.get(SESSION_COOKIE)?.value ??
    store.get(LEGACY_ADMIN_SESSION_COOKIE)?.value
  )
}
