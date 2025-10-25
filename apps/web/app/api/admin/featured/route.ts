import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

// Simple admin password check (for MVP - use proper auth later)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'woofspots2024';

function checkAdminAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

// GET - Fetch all daycares with featured status
export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { rows } = await sql`
      SELECT id, name, city, state, rating, featured, featured_order, featured_until
      FROM dog_daycares
      ORDER BY featured DESC, featured_order ASC NULLS LAST, rating DESC
      LIMIT 100
    `;

    return NextResponse.json({ daycares: rows });
  } catch (error) {
    console.error('Error fetching daycares:', error);
    return NextResponse.json({ error: 'Failed to fetch daycares' }, { status: 500 });
  }
}

// POST - Update featured status for a daycare
export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, featured, featured_order, featured_until } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing daycare ID' }, { status: 400 });
    }

    await sql`
      UPDATE dog_daycares
      SET
        featured = ${featured ?? false},
        featured_order = ${featured_order ?? null},
        featured_until = ${featured_until ?? null}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating featured status:', error);
    return NextResponse.json({ error: 'Failed to update featured status' }, { status: 500 });
  }
}

// PUT - Bulk update featured order
export async function PUT(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { updates } = body; // Array of { id, featured_order }

    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid updates format' }, { status: 400 });
    }

    // Update each daycare's order
    for (const update of updates) {
      await sql`
        UPDATE dog_daycares
        SET featured_order = ${update.featured_order}
        WHERE id = ${update.id}
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error bulk updating featured order:', error);
    return NextResponse.json({ error: 'Failed to bulk update' }, { status: 500 });
  }
}
