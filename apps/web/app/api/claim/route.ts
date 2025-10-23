import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/claim
 * Handle business listing claim requests
 *
 * TODO: Set up Resend API for email notifications
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, ownerName, email, phone, city, website, message } = body;

    // Validate required fields
    if (!businessName || !ownerName || !email || !phone || !city) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // TODO: Send email notification via Resend
    // For now, just log the request
    console.log('📧 New business claim request:', {
      businessName,
      ownerName,
      email,
      phone,
      city,
      website,
      message,
      timestamp: new Date().toISOString(),
    });

    // TODO: Store in database for tracking
    // Could create a business_claims table to track all requests

    /*
    Example Resend integration (once set up):

    import { Resend } from 'resend';
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'claims@woofhouses.com',
      to: 'hello@woofhouses.com',
      subject: `New Business Claim: ${businessName}`,
      html: `
        <h2>New Business Claim Request</h2>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Owner:</strong> ${ownerName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Website:</strong> ${website || 'Not provided'}</p>
        <p><strong>Message:</strong> ${message || 'None'}</p>
      `,
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Claim request received successfully',
    });

  } catch (error: any) {
    console.error('Claim request error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit claim request' },
      { status: 500 }
    );
  }
}
