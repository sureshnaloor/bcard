import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Update matcher to be more specific and exclude auth-related paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/vcard/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico|auth|$).*)',
  ],
}; 