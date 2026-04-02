import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all categories
export async function GET() {
  try {
    const result = await query('SELECT * FROM categories ORDER BY name ASC');
    return NextResponse.json(result.rows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST a new category
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const result = await query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
        return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}