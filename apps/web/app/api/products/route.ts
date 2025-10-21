import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/products
 * Query parameters:
 * - category: filter by category
 * - maxPrice: maximum price filter
 * - zipCode: for store availability (optional)
 * - limit: number of results (default 50)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const category = searchParams.get('category') || 'All';
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '1.00');
  const zipCode = searchParams.get('zipCode');
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    let result;

    if (category !== 'All') {
      result = await sql`
        SELECT
          id,
          product_id,
          title,
          price,
          original_price,
          price_text,
          category,
          model_number,
          url,
          image_url,
          is_clearance_price,
          scraped_at
        FROM products
        WHERE is_clearance_price = true
          AND price <= ${maxPrice}
          AND category = ${category}
        ORDER BY price ASC
        LIMIT ${limit}
      `;
    } else {
      result = await sql`
        SELECT
          id,
          product_id,
          title,
          price,
          original_price,
          price_text,
          category,
          model_number,
          url,
          image_url,
          is_clearance_price,
          scraped_at
        FROM products
        WHERE is_clearance_price = true
          AND price <= ${maxPrice}
        ORDER BY price ASC
        LIMIT ${limit}
      `;
    }

    const { rows } = result;

    // Transform database rows to match expected format
    const products = rows.map(row => ({
      id: row.id,
      productId: row.product_id,
      title: row.title,
      price: parseFloat(row.price),
      originalPrice: row.original_price ? parseFloat(row.original_price) : null,
      priceText: row.price_text,
      category: row.category,
      modelNumber: row.model_number,
      url: row.url,
      imageUrl: row.image_url,
      isClearancePrice: row.is_clearance_price,
      scrapedAt: row.scraped_at,
      // Mock store data for now - using the provided zipCode
      inStock: true,
      distance: '2.3 miles',
      storeName: `Home Depot - ${zipCode || 'Local'}`,
    }));

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      filters: { category, maxPrice, zipCode },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
