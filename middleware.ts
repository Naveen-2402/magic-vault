import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authSession = request.cookies.get('auth_session');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    // Check both existence AND correct value
    if (!authSession || authSession.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};