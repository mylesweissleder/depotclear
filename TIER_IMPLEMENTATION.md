# Tier System Implementation Summary

**Date:** October 2025
**Status:** ✅ Complete

## Overview

Implemented three-tier listing system for Woof Spots:
- **Free Unclaimed**: Name, city, reviews only (no contact info)
- **Free Claimed**: Adds website, address, phone (lead gen for Premium)
- **Premium**: Full features including photos, special offers, analytics, priority placement

## Files Modified

### Database Layer

1. **`/migrations/add-tier-system.sql`**
   - Created `listing_tier` enum type ('unclaimed', 'claimed', 'premium')
   - Added tier column with default 'unclaimed'
   - Added Stripe integration fields (customer_id, subscription_id, subscription_status)
   - Added claim tracking (claimed_at, claimed_by_email, claimed_by_name)
   - Added premium tracking (premium_since, premium_until)
   - Created helper functions:
     - `claim_listing()` - Upgrade unclaimed → claimed
     - `upgrade_to_premium()` - Upgrade to premium with Stripe IDs
     - `downgrade_from_premium()` - Cancel premium subscription
     - `is_premium_active()` - Check if premium is active
   - Created `premium_listings_summary` view for admin dashboard
   - Added indexes for performance

### API Layer

2. **`/apps/web/app/api/daycares/route.ts`**
   - Added `tier` column to SELECT queries
   - Implemented tier-based sorting:
     - Premium listings appear first
     - Claimed listings second
     - Unclaimed listings last
   - Within each tier, sort by rating DESC, then review_count DESC

### UI Layer - Listing Pages

3. **`/apps/web/app/listing/[id]/page.tsx`** (Main listing page)
   - Query tier from database
   - **Unclaimed listings:**
     - Show only: name, city, reviews
     - Hide: address, phone, website
     - Display: "Claim This Listing - FREE" CTA
   - **Claimed listings:**
     - Show: name, city, reviews, address, phone, website
     - Display: "Upgrade to Premium - $99/mo" CTA with benefits list
   - **Premium listings:**
     - Show: all features
     - Display: "⭐ PREMIUM" badge in header
     - No upgrade CTA (already premium)

4. **`/apps/web/app/daycares/[id]/page.tsx`** (Detailed listing page)
   - Query tier from database
   - **Unclaimed listings:**
     - Show: name, city, reviews
     - Hide: address, phone, email, website, special offers, photos, amenities, business hours
     - Display: "Claim This Listing - FREE" CTA
   - **Claimed listings:**
     - Show: name, city, reviews, full address, contact info (phone, email, website)
     - Hide: special offers, photos, amenities, custom description
     - Show business hours: NO (Premium only)
     - Display: "Upgrade to Premium" CTA
   - **Premium listings:**
     - Show: ALL features including special offers, photos, amenities, business hours
     - Display: "⭐ PREMIUM" badge
     - No upgrade CTA

### UI Layer - Search Results

5. **`/apps/web/app/search/page.tsx`**
   - Display tier badge on premium listings
   - Premium listings have yellow border (`border-yellow-400`)
   - **Unclaimed listings:**
     - Show: name, city, reviews
     - Hide: full address, phone, website
     - Display: "📞 Contact info available after claiming" message
   - **Claimed/Premium listings:**
     - Show: name, city, full address, phone, website, reviews
   - Results automatically sorted by tier (Premium → Claimed → Unclaimed)

## Pricing Structure

Per `/PRICING_TIERS.md`:

### Free Listing (Unclaimed)
- **Price:** FREE
- **Target:** Auto-generated from Google Maps scraping
- **Features:**
  - ✅ Business name
  - ✅ City location
  - ✅ Google Maps ratings & reviews
  - ❌ No contact info (website, phone, address)
  - ❌ No photos, description, or special features
- **CTA:** "Claim This Listing - FREE"

### Free Claimed
- **Price:** FREE
- **Target:** Business owners who claim their listing
- **Strategy:** Lead generation for Premium
- **Features:**
  - ✅ Everything from Unclaimed, PLUS:
  - ✅ **Website link** (clickable, drives traffic)
  - ✅ **Full address** (with map)
  - ✅ **Phone number** (clickable call)
  - ✅ "Verified Claim" badge
  - ❌ No priority placement
  - ❌ No photos, special offers, or analytics
- **CTA:** "Upgrade to Premium - $99/mo"

### Premium
- **Price:** $99/month or $990/year (2 months free)
- **Target:** Serious business owners wanting maximum visibility
- **Features:**
  - ✅ **Priority placement** in search results (appear first)
  - ✅ **Premium badge** (⭐ PREMIUM)
  - ✅ **Photo gallery** (up to 20 photos)
  - ✅ **Special offers** (discounts, promotions)
  - ✅ **Custom description** (500 words)
  - ✅ **Business hours** editor
  - ✅ **Amenities** display
  - ✅ **Enhanced analytics** (views, clicks, CTR)
  - ✅ **Contact form** integration
  - ✅ **Priority customer support**

## Database Schema

```sql
-- Tier column
ALTER TABLE dog_daycares
ADD COLUMN tier listing_tier DEFAULT 'unclaimed';

-- Claim tracking
ADD COLUMN claimed_at TIMESTAMP,
ADD COLUMN claimed_by_email TEXT,
ADD COLUMN claimed_by_name TEXT;

-- Premium subscription tracking
ADD COLUMN premium_since TIMESTAMP,
ADD COLUMN premium_until TIMESTAMP,

-- Stripe integration
ADD COLUMN stripe_customer_id TEXT,
ADD COLUMN stripe_subscription_id TEXT,
ADD COLUMN subscription_status TEXT;

-- Verification
ADD COLUMN verified BOOLEAN DEFAULT FALSE,
ADD COLUMN verification_method TEXT;
```

## Helper Functions

### `claim_listing(daycare_id, owner_email, owner_name)`
Upgrades an unclaimed listing to claimed tier.

### `upgrade_to_premium(daycare_id, customer_id, subscription_id, is_annual)`
Upgrades claimed/unclaimed to premium tier with Stripe integration.

### `downgrade_from_premium(daycare_id)`
Downgrades premium to claimed (on subscription cancellation).

### `is_premium_active(daycare_id)`
Returns TRUE if listing is premium and subscription is active.

## Conversion Strategy

### Unclaimed → Claimed
- Clear value prop: "Add your website, phone, and address - FREE!"
- Low friction: Simple claim form
- Prominent CTAs on listing pages

### Claimed → Premium
- Data-driven messaging: "You're getting X views/month - upgrade to get 5x more!"
- Feature comparison: Show what they're missing
- Social proof: "Join 127 premium partners"
- Limited offers: "First month 50% off"
- Email drip campaigns

## Revenue Model

**Conservative (10% conversion):**
- 100 claimed listings → 10 premium = $990/month MRR

**Moderate (20% conversion):**
- 500 claimed listings → 100 premium = $9,900/month MRR

**Optimistic (30% conversion + annual):**
- 1,000 claimed → 300 premium = $24,750/month MRR

## Next Steps

1. **Run database migration:**
   ```bash
   psql $DATABASE_URL < migrations/add-tier-system.sql
   ```

2. **Set all existing listings to 'unclaimed':**
   Already handled by migration (DEFAULT 'unclaimed')

3. **Build claim verification flow:**
   - Create `/claim` page form handler
   - Email verification for business owners
   - Admin approval dashboard (optional)

4. **Build Stripe checkout flow:**
   - Create Stripe products ($99/mo, $990/yr)
   - Build `/pricing` page with checkout
   - Implement webhook handlers
   - Customer portal for subscription management

5. **Build premium dashboard:**
   - Analytics display (views, clicks, CTR)
   - Photo/content management
   - Special offers creator

## Testing Checklist

- [ ] Verify tier column exists in database
- [ ] Test unclaimed listings hide contact info
- [ ] Test claimed listings show contact info
- [ ] Test premium listings show badge and all features
- [ ] Test search results sort premium first
- [ ] Test API returns tier data
- [ ] Test CTAs link correctly
- [ ] Verify mobile responsive design

## Analytics to Track

- % unclaimed → claimed conversion rate
- % claimed → premium conversion rate
- Average time to upgrade (claimed → premium)
- Monthly Recurring Revenue (MRR)
- Churn rate
- Premium feature usage
