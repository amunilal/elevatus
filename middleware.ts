import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Skip authentication check for login pages
    if (pathname === '/employer/login' || pathname === '/employee/login') {
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
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Check user type access
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
          '/login',
          '/employer/login',
          '/employee/login',
          '/api/auth',
          '/api/health'
        ]

        // Check if the path is public or starts with a public path
        const isPublicPath = publicPaths.some(path => 
          pathname === path || pathname.startsWith(`${path}/`)
        )

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