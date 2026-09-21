import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/', '/login', '/signup']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtectedRoute = protectedRoutes.some((r) => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some((r) => pathname === r)

  // Verify the signed session cookie only.
  //
  // Proxy runs in its own module graph, so it must not depend on app state
  // (the in-memory user store in `@/lib/users` is a different instance here and
  // is empty for every user created at runtime). The claims inside the signed
  // JWT are the source of truth, which keeps signup/login sessions valid.
  const sessionToken = request.cookies.get('session')?.value
  const session = await decrypt(sessionToken)
  const isValidUser = typeof session?.userId === 'string' && session.userId.length > 0

  // If a stale, malformed or invalid session cookie exists, clear it immediately
  if (sessionToken && !isValidUser) {
    const redirectUrl = isProtectedRoute ? new URL('/login', request.url) : null
    const response = redirectUrl
      ? NextResponse.redirect(redirectUrl)
      : NextResponse.next()
    response.cookies.delete('session')
    return response
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isValidUser) {
    const response = NextResponse.redirect(new URL('/login', request.url))
    response.cookies.delete('session')
    return response
  }

  // Redirect authenticated users away from auth pages to dashboard
  if (isAuthRoute && isValidUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
