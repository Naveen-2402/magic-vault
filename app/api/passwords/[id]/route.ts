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

    // Re-encrypt because the password might have changed
    const { iv, content } = encrypt(password, pin);

    await query(
      `UPDATE passwords 
       SET name = $1, username = $2, encrypted_password = $3, iv = $4, description = $5 
       WHERE id = $6`,
      [name, username, content, iv, desc, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}