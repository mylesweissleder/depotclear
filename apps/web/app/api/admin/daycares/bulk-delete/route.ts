import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { authenticateAdmin } from '@/lib/auth-middleware';

export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateAdmin(request);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Unauthorized' },
        { status: authResult.error === 'Admin access required' ? 403 : 401 }
      );
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No IDs provided' },
        { status: 400 }
      );
    }

    // Validate all IDs are numbers
    const validIds = ids.filter((id) => !isNaN(parseInt(id))).map((id) => parseInt(id));

    if (validIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid IDs provided' },
        { status: 400 }
      );
    }

    // Delete multiple daycares
    const result = await sql`
      DELETE FROM dog_daycares
      WHERE id = ANY(${validIds})
      RETURNING id
    `;

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.rowCount} daycare(s)`,
      deletedCount: result.rowCount,
    });
  } catch (error: any) {
    console.error('Error bulk deleting daycares:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
