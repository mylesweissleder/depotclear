import { NextRequest, NextResponse } from 'next/server';
import { authenticate } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticate(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: auth.user!.id,
          email: auth.user!.email,
          name: auth.user!.name,
          phone: auth.user!.phone,
          emailVerified: auth.user!.email_verified,
          createdAt: auth.user!.created_at,
        },
      },
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get user' },
      { status: 500 }
    );
  }
}
