import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  LEGACY_ADMIN_SESSION_COOKIE,
  SESSION_COOKIE,
  sessionCookieOptions,
} from '@/lib/admin-session'

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url))
  response.cookies.set(SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    maxAge: 0,
  })
  response.cookies.set(LEGACY_ADMIN_SESSION_COOKIE, '', {
    ...sessionCookieOptions,
    path: '/admin',
    maxAge: 0,
  })
  return response
}
