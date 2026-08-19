import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('backUrl', '/admin')
  return NextResponse.redirect(url)
}
