import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  const authPage = req.nextUrl.pathname.startsWith('/auth')

  if (!token && !authPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  if (token && authPage) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/posts/:path*', '/profile/:path*', '/'],
}
