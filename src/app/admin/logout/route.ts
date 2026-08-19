import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/logout', request.url))
}
