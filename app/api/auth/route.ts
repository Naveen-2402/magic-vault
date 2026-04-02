import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // 1. Get the master stealth password from environment variables
    const masterPassword = process.env.APP_STEALTH_PASSWORD;

    // 2. Security Check: Ensure the .env variable is actually set
    if (!masterPassword) {
      console.error("CRITICAL: APP_STEALTH_PASSWORD is not set in .env");
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    // 3. Compare the provided password
    if (password === masterPassword) {
      // Success! 
      return NextResponse.json({ 
        success: true, 
        message: "Vault access granted." 
      });
    } else {
      // Failure
      return NextResponse.json(
        { success: false, message: "Invalid access credentials." },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}