import { sql } from '@vercel/postgres';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Offer {
  id: number;
  title: string;
  description: string;
  discountAmount: number;
  discountType: 'percentage' | 'fixed';
  validFrom: string;
  validUntil: string;
  termsConditions: string;
}

async function getDaycareWithOffers(id: string) {
  try {
    // Get daycare details
    const daycareResult = await sql`
      SELECT
        id,
        name,
        address,
        city,
        state,
        zip,
        phone,
        email,
        website,
        rating,
        review_count as "reviewCount",
        description,
        business_hours as "businessHours",
        photos,
        amenities
      FROM dog_daycares
      WHERE id = ${id}
    `;

    if (daycareResult.rows.length === 0) {
      return null;
    }

    // Get active offers
    const offersResult = await sql`
      SELECT
        id,
        title,
        description,
        discount_amount as "discountAmount",
        discount_type as "discountType",
        valid_from as "validFrom",
        valid_until as "validUntil",
        terms_conditions as "termsConditions"
      FROM special_offers
      WHERE daycare_id = ${id}
        AND active = true
        AND valid_until >= NOW()
      ORDER BY created_at DESC
    `;

    return {
      daycare: daycareResult.rows[0],
      offers: offersResult.rows as Offer[],
    };
  } catch (error) {
    console.error('Error fetching daycare:', error);
    return null;
  }
}

export default async function DaycarePage({ params }: { params: { id: string } }) {
  const data = await getDaycareWithOffers(params.id);

  if (!data) {
    notFound();
  }

  const { daycare, offers } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-black text-gray-900">
            🐕 Woof Spots
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Business Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{daycare.name}</h1>
          <p className="text-gray-600 mb-4">
            {daycare.address}, {daycare.city}, {daycare.state} {daycare.zip}
          </p>

          <div className="flex items-center space-x-4 mb-4">
            {daycare.rating && (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">⭐ {daycare.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-600">({daycare.reviewCount || 0} reviews)</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {daycare.phone && (
              <a
                href={`tel:${daycare.phone}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                📞 Call Now
              </a>
            )}
            {daycare.website && (
              <a
                href={daycare.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                🌐 Visit Website
              </a>
            )}
            {daycare.email && (
              <a
                href={`mailto:${daycare.email}`}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                ✉️ Send Email
              </a>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active Offers */}
            {offers.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">🎁 Special Offers</h2>
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="border-2 border-orange-300 bg-orange-50 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{offer.title}</h3>
                        <span className="px-4 py-2 bg-orange-500 text-white rounded-full text-lg font-black shadow-lg">
                          {offer.discountType === 'percentage'
                            ? `${offer.discountAmount}% OFF`
                            : `$${offer.discountAmount} OFF`}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{offer.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          Valid until {new Date(offer.validUntil).toLocaleDateString()}
                        </span>
                        {offer.termsConditions && (
                          <button className="text-orange-600 hover:text-orange-700 font-medium">
                            View Terms
                          </button>
                        )}
                      </div>
                      {offer.termsConditions && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                            Terms & Conditions
                          </summary>
                          <p className="mt-2 text-sm text-gray-600 bg-white p-3 rounded">
                            {offer.termsConditions}
                          </p>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {daycare.description && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About Us</h2>
                <p className="text-gray-700 whitespace-pre-line">{daycare.description}</p>
              </div>
            )}

            {/* Amenities */}
            {daycare.amenities && Object.keys(daycare.amenities).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(daycare.amenities).map(([key, value]) =>
                    value ? (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-700 capitalize">{key.replace(/_/g, ' ')}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {/* Photos */}
            {daycare.photos && daycare.photos.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {daycare.photos.slice(0, 6).map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${daycare.name} photo ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {daycare.phone && (
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${daycare.phone}`} className="text-orange-600 hover:text-orange-700 font-medium">
                      {daycare.phone}
                    </a>
                  </div>
                )}
                {daycare.email && (
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${daycare.email}`} className="text-orange-600 hover:text-orange-700 font-medium">
                      {daycare.email}
                    </a>
                  </div>
                )}
                {daycare.website && (
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a
                      href={daycare.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-medium break-all"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="text-gray-900">
                    {daycare.address}
                    <br />
                    {daycare.city}, {daycare.state} {daycare.zip}
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            {daycare.businessHours && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Business Hours</h3>
                <div className="space-y-2">
                  {Object.entries(daycare.businessHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="text-gray-600 capitalize">{day}</span>
                      <span className="text-gray-900 font-medium">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Own this business?</h3>
              <p className="mb-4">Claim your listing to manage your info and create special offers!</p>
              <Link
                href="/claim"
                className="block w-full text-center px-4 py-2 bg-white text-orange-600 rounded-lg font-bold hover:bg-gray-100"
              >
                Claim This Listing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
