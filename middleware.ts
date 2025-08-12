import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Public paths that should be accessible without authentication
    const publicPaths = ['/', '/employer/login', '/employee/login']
    if (publicPaths.includes(pathname)) {
      return NextResponse.next()
    }

    // Redirect to appropriate login page if not authenticated
    if (!token) {
      if (pathname.startsWith('/employer')) {
        return NextResponse.redirect(new URL('/employer/login', req.url))
      }
      if (pathname.startsWith('/employee')) {
        return NextResponse.redirect(new URL('/employee/login', req.url))
      }
      // For any other protected route, redirect to home page
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Check user type access for authenticated users
    if (pathname.startsWith('/employer') && token.userType !== 'EMPLOYER') {
      return NextResponse.redirect(new URL('/employee/dashboard', req.url))
    }

    if (pathname.startsWith('/employee') && token.userType !== 'EMPLOYEE') {
      return NextResponse.redirect(new URL('/employer/dashboard', req.url))
    }

    // API route protection
    if (pathname.startsWith('/api/employer') && token.userType !== 'EMPLOYER') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    if (pathname.startsWith('/api/employee') && token.userType !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Public paths that don't require authentication
        const publicPaths = [
          '/',
          '/employer/login',
          '/employee/login',
          '/api/auth',
          '/api/health'
        ]

        // Check if the path is public
        const isPublicPath = publicPaths.some(path => 
          pathname === path || pathname.startsWith(`${path}/`)
        )

        // Allow access to public paths
        if (isPublicPath) {
          return true
        }

        // All other paths require authentication
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    // Match all paths except static files and API auth routes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)'
  ]
}