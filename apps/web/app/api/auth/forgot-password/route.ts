import { NextResponse } from 'next/server';
import { createPasswordResetToken, findUserByEmail } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      // Don't reveal whether the email exists
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent',
      });
    }

    // Create reset token
    const token = await createPasswordResetToken(email);

    // TODO: Send password reset email with token
    console.log('Password reset token:', token);
    console.log('Reset link:', `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`);

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
