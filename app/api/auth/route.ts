import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const masterPassword = process.env.APP_STEALTH_PASSWORD;

    if (!masterPassword) {
      console.error("CRITICAL: APP_STEALTH_PASSWORD is not set in .env");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    if (password === masterPassword) {
      const response = NextResponse.json({ 
        success: true, 
        message: "Vault access granted." 
      });

      // Set cookie SERVER-SIDE — JS can never read or forge this
      response.cookies.set('auth_session', 'true', {
        httpOnly: true,       // JS cannot access it at all
        secure: true,         // HTTPS only
        sameSite: 'strict',   // No cross-site sending
        maxAge: 60 * 60 * 24, // 1 day in seconds
        path: '/',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid access credentials." },
        { status: 401 }
      );
    }
  } catch {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}