import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { z } from 'zod';

/**
 * API Route: POST /api/submit-business
 * Allows users to submit missing dog daycare businesses
 * Submissions go into pending review status
 */

const SubmissionSchema = z.object({
  name: z.string().min(2, 'Business name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().length(2, 'State must be 2 letters (e.g., CA)'),
  zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  phone: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  submitterName: z.string().min(2, 'Your name is required'),
  submitterEmail: z.string().email('Valid email is required'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const validatedData = SubmissionSchema.parse(body);

    // Check for duplicates (same name in same city)
    const existingBusiness = await sql`
      SELECT id, name, city, verification_status
      FROM dog_daycares
      WHERE LOWER(name) = LOWER(${validatedData.name})
        AND LOWER(city) = LOWER(${validatedData.city})
      LIMIT 1
    `;

    if (existingBusiness.rows.length > 0) {
      const existing = existingBusiness.rows[0];

      // If already verified, tell user it exists
      if (existing.verification_status === 'verified' || existing.verification_status === 'unverified') {
        return NextResponse.json(
          {
            error: 'Business already exists',
            message: `${validatedData.name} in ${validatedData.city} is already in our database.`,
            businessId: existing.id,
          },
          { status: 409 }
        );
      }

      // If pending, tell user it's already submitted
      if (existing.verification_status === 'pending') {
        return NextResponse.json(
          {
            error: 'Already submitted',
            message: `${validatedData.name} has already been submitted and is awaiting review.`,
          },
          { status: 409 }
        );
      }
    }

    // Submit business using database function
    const result = await sql`
      SELECT submit_business(
        ${validatedData.name},
        ${validatedData.address},
        ${validatedData.city},
        ${validatedData.state},
        ${validatedData.zipCode},
        ${validatedData.phone || null},
        ${validatedData.website || null},
        ${validatedData.submitterName},
        ${validatedData.submitterEmail}
      ) as business_id
    `;

    const newBusinessId = result.rows[0].business_id;

    // TODO: Send confirmation email to submitter
    // await sendSubmissionConfirmationEmail(validatedData.submitterEmail, validatedData.name);

    // TODO: Notify admin of new submission
    // await sendAdminNotification(newBusinessId, validatedData.name, validatedData.city);

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your submission has been received and will be reviewed shortly.',
        businessId: newBusinessId,
      },
      { status: 201 }
    );

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.errors.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

    // Handle database errors
    console.error('Submission error:', error);
    return NextResponse.json(
      {
        error: 'Server error',
        message: 'Failed to process your submission. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// GET endpoint for admin to retrieve pending submissions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const limit = parseInt(searchParams.get('limit') || '50');

    const submissions = await sql`
      SELECT
        id,
        name,
        city,
        state,
        address,
        phone,
        website,
        submitted_by_name,
        submitted_by_email,
        submitted_at,
        verification_status,
        reviewed_by,
        reviewed_at,
        review_notes,
        EXTRACT(EPOCH FROM (NOW() - submitted_at))/3600 AS hours_pending
      FROM dog_daycares
      WHERE verification_status = ${status}
      ORDER BY submitted_at DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({
      submissions: submissions.rows,
      total: submissions.rowCount,
    });

  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
