import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
    const isSignInPage = req.nextUrl.pathname === '/auth/signin'

    // If user is authenticated and tries to access auth pages (except signin), redirect to admin dashboard
    if (isAuthPage && !isSignInPage && req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url))
    }

    // If user is not authenticated and tries to access admin pages, redirect to signin
    if (isAdminPage && !req.nextauth.token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        const isAdminPage = req.nextUrl.pathname.startsWith('/admin')
        const isSignInPage = req.nextUrl.pathname === '/auth/signin'

        // Allow unauthenticated access to signin page
        if (isSignInPage) return true

        // Require authentication for admin pages
        if (isAdminPage) return !!token

        // Allow all other pages
        return true
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/cart/:path*',
    '/wishlist/:path*',
    '/test-location/:path*',
    '/store/:path*',
    '/store',
    '/checkout/:path*',
    '/checkout',
  ],
}; 