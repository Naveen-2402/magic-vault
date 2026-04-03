import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { encrypt } from '@/lib/crypto';

// DELETE a specific password entry
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await query('DELETE FROM passwords WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[DELETE /api/passwords]', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}

// PUT: Update an existing password entry
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { name, username, password, desc, pin } = await request.json();

    // Guard: pin is required for encryption
    if (!pin || typeof pin !== 'string' || pin.trim() === '') {
      return NextResponse.json(
        { error: 'Session PIN is missing. Please log out and log back in.' },
        { status: 400 }
      );
    }

    // Guard: password must exist to encrypt
    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password field is required.' },
        { status: 400 }
      );
    }

    // Re-encrypt with the split key
    const { iv, content } = encrypt(password, pin);

    await query(
      `UPDATE passwords 
       SET name = $1, username = $2, encrypted_password = $3, iv = $4, description = $5 
       WHERE id = $6`,
      [name, username, content, iv, desc, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/passwords]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}