import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { encrypt, decrypt } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { categoryId, name, username, password, desc, pin } = body;

    if (!pin || pin.length !== 4) {
      return NextResponse.json({ error: 'PIN must be 4 characters' }, { status: 400 });
    }

    // Encrypt all 4 fields individually
    const eName = encrypt(name || '', pin);
    const eUser = encrypt(username || '', pin);
    const ePass = encrypt(password || '', pin);
    const eDesc = encrypt(desc || '', pin);

    // Insert into the NEW column names
    const res = await query(
      `INSERT INTO passwords 
      (category_id, name_enc, name_iv, user_enc, user_iv, pass_enc, pass_iv, desc_enc, desc_iv) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        categoryId, 
        eName.content, eName.iv, 
        eUser.content, eUser.iv, 
        ePass.content, ePass.iv, 
        eDesc.content, eDesc.iv
      ]
    );

    return NextResponse.json({ success: true, id: res.rows[0].id });
  } catch (error: any) {
    // THIS IS THE KEY: Look at your terminal for this output!
    console.error("DATABASE POST ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('categoryId');
  const pin = request.headers.get('x-session-pin');

  if (!pin || pin.length !== 4) {
    return NextResponse.json({ error: 'Unauthorized: Session PIN required' }, { status: 401 });
  }

  try {
    const res = await query('SELECT * FROM passwords WHERE category_id = $1', [categoryId]);
    
    const decryptedEntries = res.rows.map(row => ({
      id: row.id,
      name: decrypt(row.name_enc, row.name_iv, pin) || "!! Locked !!",
      username: decrypt(row.user_enc, row.user_iv, pin) || "",
      password: decrypt(row.pass_enc, row.pass_iv, pin) || "********",
      description: decrypt(row.desc_enc, row.desc_iv, pin) || ""
    }));

    return NextResponse.json(decryptedEntries);
  } catch (error: any) {
    console.error("DATABASE GET ERROR:", error.message);
    return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
  }
}