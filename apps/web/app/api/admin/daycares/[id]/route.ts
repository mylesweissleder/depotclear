import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { authenticateAdmin } from '@/lib/auth-middleware';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid daycare ID' },
        { status: 400 }
      );
    }

    // Delete the daycare
    const result = await sql`
      DELETE FROM dog_daycares
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Daycare not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Daycare deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting daycare:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid daycare ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      name,
      city,
      state,
      address,
      phone,
      website,
      rating,
      review_count,
      place_id,
      tier,
    } = body;

    // Validate required fields
    if (!name || !city) {
      return NextResponse.json(
        { success: false, error: 'Name and city are required' },
        { status: 400 }
      );
    }

    // Update the daycare
    const result = await sql`
      UPDATE dog_daycares
      SET
        name = ${name},
        city = ${city},
        state = ${state || null},
        address = ${address || null},
        phone = ${phone || null},
        website = ${website || null},
        rating = ${rating || null},
        review_count = ${review_count || null},
        place_id = ${place_id || null},
        tier = ${tier || null},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Daycare not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        daycare: result.rows[0],
      },
    });
  } catch (error: any) {
    console.error('Error updating daycare:', error);

    // Handle duplicate place_id or unique constraint violations
    if (error.code === '23505') {
      return NextResponse.json(
        { success: false, error: 'Daycare with this information already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
