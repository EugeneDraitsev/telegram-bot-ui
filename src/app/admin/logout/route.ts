import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import {
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
} from '@/lib/admin-session'

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/sign-in', request.url))
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...adminCookieOptions,
    maxAge: 0,
  })
  return response
}
