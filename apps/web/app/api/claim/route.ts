import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key_for_build");

/**
 * POST /api/claim
 * Handle business listing claim requests
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listingId, businessName, ownerName, email, phone, city, website, message } = body;

    // Validate required fields
    if (!ownerName || !email) {
      return NextResponse.json(
        { success: false, error: 'Owner name and email are required' },
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

    // Two paths: Direct claim with listing ID, or manual claim request
    if (listingId) {
      // Direct claim - update listing immediately
      try {
        // Check if listing exists and is unclaimed
        const listing = await sql`
          SELECT id, name, tier, city
          FROM dog_daycares
          WHERE id = ${listingId}
        `;

        if (listing.rows.length === 0) {
          return NextResponse.json(
            { success: false, error: 'Listing not found' },
            { status: 404 }
          );
        }

        const currentListing = listing.rows[0];

        if (currentListing.tier !== 'unclaimed' && currentListing.tier !== null) {
          return NextResponse.json(
            { success: false, error: 'This listing has already been claimed' },
            { status: 400 }
          );
        }

        // Claim the listing using the database function
        await sql`
          SELECT claim_listing(
            ${listingId},
            ${email},
            ${ownerName}
          )
        `;

        // Send confirmation email to business owner
        try {
          await resend.emails.send({
            from: 'Woof Spots <hello@woofspots.com>',
            to: [email],
            subject: `You've claimed ${currentListing.name} on Woof Spots!`,
            html: `
              <h2>🎉 Congratulations! Your listing is now claimed!</h2>
              <p>Hi ${ownerName},</p>
              <p>You've successfully claimed <strong>${currentListing.name}</strong> on Woof Spots.</p>

              <h3>What's Next?</h3>
              <p>Your listing now includes:</p>
              <ul>
                <li>✅ Your website link</li>
                <li>✅ Full address</li>
                <li>✅ Phone number</li>
                <li>✅ "Verified Claim" badge</li>
              </ul>

              <h3>Want Even More Visibility?</h3>
              <p>Upgrade to Premium to get:</p>
              <ul>
                <li>⭐ Priority placement in search results</li>
                <li>📸 Photo gallery (up to 20 photos)</li>
                <li>🎁 Special offers & promotions</li>
                <li>📊 Enhanced analytics dashboard</li>
                <li>📞 Contact form integration</li>
              </ul>
              <p><strong>Just $99/month or $990/year (2 months free!)</strong></p>
              <p><a href="https://woofspots.com/pricing?id=${listingId}" style="background: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 16px;">Upgrade to Premium</a></p>

              <hr style="margin: 32px 0; border: none; border-top: 1px solid #E5E7EB;" />
              <p style="color: #6B7280; font-size: 14px;">
                Have questions? Reply to this email or visit our <a href="https://woofspots.com">help center</a>.
              </p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the claim if email fails
        }

        // Notify admin
        try {
          await resend.emails.send({
            from: 'Woof Spots Claims <claims@woofspots.com>',
            to: ['hello@woofspots.com'],
            subject: `✅ Listing Claimed: ${currentListing.name}`,
            html: `
              <h2>New Listing Claimed</h2>
              <p><strong>Business:</strong> ${currentListing.name}</p>
              <p><strong>Owner:</strong> ${ownerName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>City:</strong> ${currentListing.city}</p>
              <p><strong>Listing ID:</strong> ${listingId}</p>
              <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            `,
          });
        } catch (emailError) {
          console.error('Failed to notify admin:', emailError);
        }

        return NextResponse.json({
          success: true,
          message: 'Listing claimed successfully!',
          listingId,
        });

      } catch (dbError: any) {
        console.error('Database error during claim:', dbError);
        return NextResponse.json(
          { success: false, error: 'Failed to claim listing. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      // Manual claim request (no listing ID) - just notify admin
      console.log('📧 Manual claim request:', {
        businessName,
        ownerName,
        email,
        phone,
        city,
        website,
        message,
        timestamp: new Date().toISOString(),
      });

      try {
        await resend.emails.send({
          from: 'Woof Spots Claims <claims@woofspots.com>',
          to: ['hello@woofspots.com'],
          subject: `Manual Claim Request: ${businessName}`,
          html: `
            <h2>Manual Business Claim Request</h2>
            <p><strong>Business:</strong> ${businessName}</p>
            <p><strong>Owner:</strong> ${ownerName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Website:</strong> ${website || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'None'}</p>
            <p><em>This business may not have a listing yet. Consider reaching out to verify.</em></p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send claim request email:', emailError);
      }

      return NextResponse.json({
        success: true,
        message: 'Claim request received. We\'ll contact you within 24 hours.',
      });
    }

  } catch (error: any) {
    console.error('Claim request error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit claim request' },
      { status: 500 }
    );
  }
}
