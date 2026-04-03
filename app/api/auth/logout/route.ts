import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the HttpOnly cookie server-side
  response.cookies.set('auth_session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 0, // Immediately expire it
    path: '/',
  });

  return response;
}