import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with actual DB queries
const mockProducts = [
  {
    id: 1,
    productId: 'HD-001',
    title: 'LED Work Light 1000 Lumens',
    price: 0.03,
    originalPrice: 29.99,
    category: 'Lighting',
    modelNumber: 'LED-1000',
    imageUrl: null,
    url: 'https://www.homedepot.com/p/123456',
    isClearancePrice: true,
    scrapedAt: new Date().toISOString(),
  },
  {
    id: 2,
    productId: 'HD-002',
    title: 'Cordless Drill Battery Pack',
    price: 0.88,
    originalPrice: 49.99,
    category: 'Tools',
    modelNumber: 'BAT-18V',
    imageUrl: null,
    url: 'https://www.homedepot.com/p/789012',
    isClearancePrice: true,
    scrapedAt: new Date().toISOString(),
  },
];

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
    // TODO: Replace with actual database query
    // Example using @vercel/postgres:
    // const { rows } = await sql`
    //   SELECT * FROM clearance_deals
    //   WHERE price <= ${maxPrice}
    //   ${category !== 'All' ? sql`AND category = ${category}` : sql``}
    //   ORDER BY price ASC
    //   LIMIT ${limit}
    // `;

    let filteredProducts = mockProducts.filter(p => {
      if (category !== 'All' && p.category !== category) return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    // Simulate store availability if zipCode provided
    const productsWithStores = filteredProducts.map(product => ({
      ...product,
      stores: zipCode ? [
        {
          storeName: 'Home Depot - Pasadena',
          storeId: 'HD-001',
          distance: 2.3,
          inStock: Math.random() > 0.3,
          stockStatus: 'In Stock',
        },
        {
          storeName: 'Home Depot - Glendale',
          storeId: 'HD-002',
          distance: 4.1,
          inStock: Math.random() > 0.3,
          stockStatus: 'Limited Stock',
        },
      ] : [],
    }));

    return NextResponse.json({
      success: true,
      data: productsWithStores,
      count: productsWithStores.length,
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
