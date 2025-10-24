import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * Search for unclaimed dog daycare listings by name and/or city
 * This allows business owners to find their listing to claim it
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const city = searchParams.get('city') || '';

    if (!query && !city) {
      return NextResponse.json(
        { success: false, error: 'Search query or city is required' },
        { status: 400 }
      );
    }

    // Search for daycares that match the query and are not claimed
    // or have pending claims (we'll show claim status)
    let results;

    if (query && city) {
      results = await sql`
        SELECT
          d.*,
          bc.id as claim_id,
          bc.status as claim_status,
          bc.user_id as claimed_by_user_id
        FROM dog_daycares d
        LEFT JOIN business_claims bc ON d.id = bc.daycare_id AND bc.status IN ('pending', 'approved')
        WHERE
          (LOWER(d.name) LIKE LOWER(${'%' + query + '%'})
          OR LOWER(d.address) LIKE LOWER(${'%' + query + '%'}))
          AND LOWER(d.city) LIKE LOWER(${'%' + city + '%'})
        ORDER BY d.name
        LIMIT 20
      `;
    } else if (query) {
      results = await sql`
        SELECT
          d.*,
          bc.id as claim_id,
          bc.status as claim_status,
          bc.user_id as claimed_by_user_id
        FROM dog_daycares d
        LEFT JOIN business_claims bc ON d.id = bc.daycare_id AND bc.status IN ('pending', 'approved')
        WHERE
          LOWER(d.name) LIKE LOWER(${'%' + query + '%'})
          OR LOWER(d.address) LIKE LOWER(${'%' + query + '%'})
        ORDER BY d.name
        LIMIT 20
      `;
    } else {
      results = await sql`
        SELECT
          d.*,
          bc.id as claim_id,
          bc.status as claim_status,
          bc.user_id as claimed_by_user_id
        FROM dog_daycares d
        LEFT JOIN business_claims bc ON d.id = bc.daycare_id AND bc.status IN ('pending', 'approved')
        WHERE LOWER(d.city) LIKE LOWER(${'%' + city + '%'})
        ORDER BY d.name
        LIMIT 20
      `;
    }

    // Format results with claim status
    const listings = results.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      address: row.address,
      city: row.city,
      state: row.state,
      zip: row.zip,
      phone: row.phone,
      website: row.website,
      rating: row.rating,
      reviewCount: row.review_count,
      claimed: row.claim_status === 'approved',
      claimPending: row.claim_status === 'pending',
      claimId: row.claim_id,
    }));

    return NextResponse.json({
      success: true,
      data: {
        listings,
        count: listings.length,
      },
    });
  } catch (error: any) {
    console.error('Search listings error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search listings' },
      { status: 500 }
    );
  }
}
