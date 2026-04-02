import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the user has the auth cookie we set in SecretGate.tsx
  const authSession = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  // Protect all routes starting with /dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!authSession) {
      // No session? Send them back to the landing page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Only run this middleware on dashboard routes for better performance
export const config = {
  matcher: '/dashboard/:path*',
};