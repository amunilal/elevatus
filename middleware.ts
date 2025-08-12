import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public paths that don't require authentication
  const publicPaths = [
    '/',
    '/employer/login',
    '/employee/login',
    '/employer/forgot-password',
    '/employee/forgot-password',
  ]

  // API auth paths that should always be accessible
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/api/health')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  // Get the session token
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

  // Redirect to appropriate login page if not authenticated
  if (!token) {
    if (pathname.startsWith('/employer')) {
      return NextResponse.redirect(new URL('/employer/login', request.url))
    }
    if (pathname.startsWith('/employee')) {
      return NextResponse.redirect(new URL('/employee/login', request.url))
    }
    // For any other protected route, redirect to home page
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Check user type access for authenticated users
  if (pathname.startsWith('/employer') && token.userType !== 'EMPLOYER') {
    return NextResponse.redirect(new URL('/employee/dashboard', request.url))
  }

  if (pathname.startsWith('/employee') && token.userType !== 'EMPLOYEE') {
    return NextResponse.redirect(new URL('/employer/dashboard', request.url))
  }

  // API route protection
  if (pathname.startsWith('/api/employer') && token.userType !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  if (pathname.startsWith('/api/employee') && token.userType !== 'EMPLOYEE') {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and some API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:css|js|png|jpg|jpeg|gif|ico|svg)$).*)'
  ]
}