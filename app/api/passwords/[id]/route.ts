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
    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { error: 'Session PIN is missing. Please log out and log back in.' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password field is required.' },
        { status: 400 }
      );
    }

    // Encrypt all 4 fields individually — matches the schema
    const eName = encrypt(name || '', pin);
    const eUser = encrypt(username || '', pin);
    const ePass = encrypt(password || '', pin);
    const eDesc = encrypt(desc || '', pin);

    await query(
      `UPDATE passwords 
       SET name_enc = $1, name_iv = $2,
           user_enc = $3, user_iv = $4,
           pass_enc = $5, pass_iv = $6,
           desc_enc = $7, desc_iv = $8
       WHERE id = $9`,
      [
        eName.content, eName.iv,
        eUser.content, eUser.iv,
        ePass.content, ePass.iv,
        eDesc.content, eDesc.iv,
        id
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PUT /api/passwords]', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}