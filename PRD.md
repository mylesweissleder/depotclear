# Product Requirements Document: Woof Spots Dog Daycare Directory

**Version:** 2.0
**Last Updated:** October 24, 2025
**Status:** MVP Complete - Production Ready
**Brand Name:** Woof Spots (formerly "Bay Area Dog Daycare Directory")

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Market Opportunity](#2-market-opportunity)
3. [Product Architecture](#3-product-architecture)
4. [Three-Tier Listing System](#4-three-tier-listing-system)
5. [Core Features](#5-core-features)
6. [Premium Features (Top Dog)](#6-premium-features-top-dog)
7. [Data Model](#7-data-model)
8. [API Endpoints](#8-api-endpoints)
9. [User Experience](#9-user-experience)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Payment & Subscription System](#11-payment--subscription-system)
12. [Business Dashboard](#12-business-dashboard)
13. [Data Collection](#13-data-collection)
14. [Legal & Compliance](#14-legal--compliance)
15. [Growth Strategy](#15-growth-strategy)
16. [Growth Engine: Photo Contest, Newsletter & Social Media](#16-growth-engine-photo-contest-newsletter--social-media)
17. [Success Metrics](#17-success-metrics)
18. [Technical Roadmap](#18-technical-roadmap)
19. [Risks & Mitigation](#19-risks--mitigation)
20. [Open Questions & Future Considerations](#20-open-questions--future-considerations)
21. [Appendix](#21-appendix)

---

## 1. Executive Summary

### 1.1 Product Vision
A comprehensive, accurate directory of dog daycare facilities across the San Francisco Bay Area that connects pet owners with verified, high-quality care options while providing business owners with premium marketing and management tools through a three-tier listing system.

### 1.2 Product Mission
To be the most trusted and comprehensive resource for dog daycare discovery in the Bay Area by:
- Providing 100% accurate, Google Maps-sourced business information
- Offering a transparent three-tier system: Free (Unclaimed), Free (Claimed), Premium (Top Dog)
- Driving direct traffic to business websites (not just aggregating reviews)
- Providing premium tools for business owners to manage and promote their listings
- Expanding to other major metropolitan areas

### 1.3 Brand Identity
**Name:** Woof Spots
**Tagline:** "Find the perfect spot for your pup"
**Visual Identity:**
- Bright, friendly color palette (orange #f97316, pink #ec4899, yellow #fbbf24)
- Playful, pet-friendly aesthetic
- Dog emoji branding (🐕)
- Bold, modern typography
- High-contrast design for accessibility

### 1.4 Target Users

**Primary Users:**
- Dog owners seeking daycare services in the SF Bay Area
- Demographics: 25-55, urban/suburban residents, median income $75k+
- Tech-savvy, mobile-first users
- Quality-conscious pet parents

**Secondary Users:**
- Dog daycare business owners/operators
- Demographics: Small business owners, 30-60, managing 5-50 employee facilities
- Seeking online visibility and marketing tools
- New Bay Area residents researching pet services
- Out-of-town visitors needing temporary pet care

### 1.5 Value Proposition

**For Pet Owners:**
- Comprehensive directory of 6,837+ verified dog daycares
- Accurate Google Maps data (ratings, reviews, hours)
- Advanced search and filtering
- Direct access to business websites
- Free, no registration required

**For Business Owners:**
- **Unclaimed Tier (Free):** Basic listing with Google Maps data
- **Claimed Tier (Free):** Enhanced visibility with contact information
- **Top Dog Tier ($99/mo or $990/yr):** Premium placement, photos, analytics, and marketing tools

---

## 2. Market Opportunity

### 2.1 Market Size

**Current Coverage:**
- **Listings:** 6,837 dog daycare businesses
- **Geographic Coverage:** 90+ cities across 8 Bay Area counties:
  - San Francisco County
  - Marin County
  - Sonoma County
  - Napa County
  - Contra Costa County
  - Alameda County
  - Santa Clara County
  - San Mateo County

**Target Market Size:**
- Bay Area dog owners: ~1.2 million households
- Average spend on pet care: $1,500-3,000/year
- Dog daycare market size (Bay Area): $150-300M annually

**Expansion Markets (Planned):**
- **Phase 2 (Q2 2026):** Los Angeles Metro, San Diego Metro
- **Phase 3 (Q3-Q4 2026):** Seattle, Portland, Denver, Austin

### 2.2 Competitive Landscape

**Direct Competitors:**
- Yelp (general business directory)
- Google Maps (search only, no listings directory)
- Rover (pet sitting marketplace, not directory)
- Local pet blogs/guides (outdated, incomplete)

**Competitive Advantages:**
1. **Data Accuracy:** 100% Google Maps sourced - no fake ratings
2. **Three-Tier System:** Free listings for all, premium options for growth
3. **Business-First Approach:** Drive traffic to business websites
4. **Comprehensive Coverage:** 6,837 listings vs. competitors' fragmented data
5. **Proper Attribution:** Legally compliant with clear sourcing
6. **Modern Tech Stack:** Fast, mobile-optimized, serverless architecture

### 2.3 Business Model

**Revenue Streams:**
1. **Top Dog Subscriptions:**
   - Monthly: $99/month
   - Annual: $990/year (save $198, 2 months free)
   - Target: 5-10% conversion of claimed listings

2. **Future Revenue (Planned):**
   - Featured homepage placements
   - Sponsored search results
   - Lead generation (contact form submissions)
   - API access for partners

**Unit Economics (Projected):**
- Customer Acquisition Cost (CAC): $50-150
- Lifetime Value (LTV): $1,200-3,000 (annual subscribers)
- LTV/CAC Ratio: 10-20x (healthy SaaS metrics)
- Churn Rate Target: <10% monthly

---

## 3. Product Architecture

### 3.1 Technology Stack

**Frontend:**
- **Framework:** Next.js 15 (App Router)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Context API
- **Forms:** React Hook Form (future)

**Backend:**
- **API:** Next.js API Routes (serverless)
- **Database:** Vercel Postgres (Neon) - PostgreSQL 15
- **ORM:** Vercel SQL (@vercel/postgres)
- **Authentication:** JWT tokens with httpOnly cookies
- **Password Hashing:** bcrypt

**Payments:**
- **Provider:** Stripe
- **Integration:** Stripe Checkout, Customer Portal, Webhooks
- **Products:** 2 subscription plans (monthly, annual)

**Data Collection:**
- **Browser Automation:** Playwright
- **Scraping Target:** Google Maps
- **Anti-Detection:** User-agent spoofing, stealth mode
- **Rate Limiting:** 2-5 second delays between requests

**Infrastructure:**
- **Hosting:** Vercel (Edge Network)
- **Database:** Neon (serverless Postgres)
- **CDN:** Vercel Edge Network
- **Monitoring:** Vercel Analytics (future)
- **Error Tracking:** Sentry (future)

**Development Tools:**
- **Monorepo:** Turborepo
- **Package Manager:** npm
- **Version Control:** Git
- **CI/CD:** Vercel (automatic deployments)

### 3.2 Project Structure

```
depotclear/
├── apps/
│   └── web/                          # Next.js application
│       ├── app/
│       │   ├── page.tsx              # Homepage
│       │   ├── search/page.tsx       # Search/directory
│       │   ├── listing/[id]/page.tsx # Individual listing
│       │   ├── pricing/page.tsx      # Pricing page (Top Dog)
│       │   ├── login/page.tsx        # User login
│       │   ├── register/page.tsx     # User registration
│       │   ├── claim/page.tsx        # Claim listing flow
│       │   ├── dashboard/page.tsx    # Business owner dashboard
│       │   └── api/
│       │       ├── auth/
│       │       │   ├── login/route.ts
│       │       │   ├── register/route.ts
│       │       │   └── me/route.ts
│       │       ├── daycares/route.ts
│       │       ├── claims/
│       │       │   └── route.ts
│       │       └── subscriptions/
│       │           ├── create-checkout/route.ts
│       │           └── webhook/route.ts
│       ├── lib/
│       │   ├── db.ts                 # Database connection
│       │   ├── auth.ts               # Auth utilities
│       │   ├── stripe.ts             # Stripe configuration
│       │   └── auth-context.tsx      # React auth context
│       └── middleware.ts             # Auth middleware
├── packages/
│   └── scraper/                      # Data collection tools
│       ├── src/
│       │   └── enhanced-scraper.js   # Google Maps scraper
│       └── cities/
│           └── bay-area.json         # City list
├── scripts/
│   └── run-tier-migration.js         # Database migration script
├── migrations/
│   ├── add-tier-system.sql           # Tier system migration
│   └── add-tier-functions.sql        # Database functions
├── run-migration-now.sh              # Migration runner script
├── MIGRATION_INSTRUCTIONS.md         # Migration documentation
├── STRIPE_PRODUCT_DESCRIPTIONS.md    # Stripe setup guide
├── PRICING_TIERS.md                  # Tier system spec
└── PRD.md                            # This document
```

### 3.3 Database Architecture

**Database:** PostgreSQL 15 (Neon serverless)
**Connection:** Pooled connections via @vercel/postgres
**Backup Strategy:** Neon automatic backups (7-day retention)
**Scaling:** Automatic serverless scaling

**Tables:**
1. `dog_daycares` - Business listings (6,837+ records)
2. `users` - Business owner accounts
3. `business_claims` - Ownership verification (future)
4. `analytics_events` - Tracking data (future)

---

## 4. Three-Tier Listing System

### 4.1 System Overview

**Philosophy:** Progressive value delivery
- **Unclaimed (Free):** Basic discovery, no commitment
- **Claimed (Free):** Enhanced visibility, ownership verification
- **Top Dog (Paid):** Premium marketing tools, priority placement

**Database Implementation:**
```sql
CREATE TYPE listing_tier AS ENUM ('unclaimed', 'claimed', 'top_dog');
```

**Tier Transitions:**
- Unclaimed → Claimed: Free, requires email verification
- Claimed → Top Dog: Paid subscription via Stripe
- Top Dog → Claimed: Automatic downgrade on subscription cancellation

### 4.2 Tier 1: Unclaimed (Free)

**Target Audience:** All businesses (default state)

**Features:**
- ✅ Basic listing in directory
- ✅ Google Maps data (name, address, phone)
- ✅ Google Maps ratings and reviews (attributed)
- ✅ Google Maps link for directions
- ✅ City/region visibility
- ✅ Search and filter inclusion
- ❌ No website link displayed
- ❌ No contact form
- ❌ No photo gallery
- ❌ No business owner dashboard access

**Business Rules:**
- Default tier for all scraped listings
- Cannot be edited by anyone
- Data refreshed weekly from Google Maps
- No verification required
- No expiration

**Database Fields (Unclaimed):**
```sql
tier = 'unclaimed'
claimed_at = NULL
claimed_by_email = NULL
claimed_by_name = NULL
top_dog_since = NULL
top_dog_until = NULL
stripe_customer_id = NULL
stripe_subscription_id = NULL
subscription_status = NULL
```

**User Experience:**
- Listing card shows basic info only
- Listing page has "Claim This Business" CTA
- No dashboard access
- No owner contact information

### 4.3 Tier 2: Claimed (Free)

**Target Audience:** Business owners who verify ownership

**Features:**
- ✅ All Unclaimed features, plus:
- ✅ **Website link displayed** (primary CTA)
- ✅ Contact information (phone, email)
- ✅ "Claimed & Verified" badge
- ✅ Business owner dashboard access (basic)
- ✅ Edit business description
- ✅ Update contact information
- ✅ Manage business hours
- ✅ View basic analytics (page views)
- ❌ No photo uploads (limited to Google Maps photos)
- ❌ No priority placement in search
- ❌ No special offers/promotions
- ❌ No advanced analytics

**Verification Process:**
1. User creates account (email + password)
2. User searches for their business
3. User clicks "Claim This Business"
4. User verifies via email confirmation
5. User gains dashboard access
6. Listing upgraded to "claimed" tier

**Database Fields (Claimed):**
```sql
tier = 'claimed'
claimed_at = NOW()
claimed_by_email = 'owner@business.com'
claimed_by_name = 'John Doe'
top_dog_since = NULL
top_dog_until = NULL
stripe_customer_id = NULL
stripe_subscription_id = NULL
subscription_status = NULL
verified = TRUE
verification_method = 'email'
```

**Business Rules:**
- One claim per business (enforced by unique constraint)
- Email verification required
- No subscription payment required
- Can upgrade to Top Dog anytime
- Can transfer ownership (future feature)

**User Experience:**
- Listing card shows "Claimed & Verified" badge
- Listing page prioritizes website link
- Dashboard shows basic analytics
- "Upgrade to Top Dog" CTA visible in dashboard

### 4.4 Tier 3: Top Dog (Premium)

**Target Audience:** Business owners seeking maximum visibility and growth

**Pricing:**
- **Monthly Plan:** $99/month
  - Recurring billing
  - Cancel anytime
  - No commitment

- **Annual Plan:** $990/year
  - Save $198 (2 months free = 17% discount)
  - Billed annually
  - Lock in rate (no price increases during subscription)
  - Best value for committed businesses

**Features:**
- ✅ All Claimed features, plus:
- ✅ **Priority Placement:** Top of search results
- ✅ **"⭐ TOP DOG" Premium Badge:** Visual distinction
- ✅ **Photo Gallery:** Upload up to 20 custom photos
- ✅ **Special Offers & Promotions:** Create unlimited offers
- ✅ **Enhanced Analytics Dashboard:**
  - Page views (daily, weekly, monthly)
  - Click-through rates (website, phone, directions)
  - Conversion tracking
  - Competitor insights
- ✅ **Contact Form Integration:** Direct lead generation
- ✅ **Business Hours Editor:** Custom display
- ✅ **Custom Business Description:** 500-word limit
- ✅ **Priority Support:** Email support within 24 hours
- ✅ **Early Access:** New features before general release

**Payment Integration:**
- Stripe Checkout for subscriptions
- Automatic billing on renewal
- Customer portal for subscription management
- Webhook automation for tier upgrades/downgrades
- Prorated billing for plan changes

**Database Fields (Top Dog):**
```sql
tier = 'top_dog'
claimed_at = '2025-01-15 10:30:00'
claimed_by_email = 'owner@business.com'
claimed_by_name = 'John Doe'
top_dog_since = '2025-02-01 14:00:00'
top_dog_until = NULL  -- NULL = active monthly
                      -- OR '2026-02-01' for annual
stripe_customer_id = 'cus_ABC123'
stripe_subscription_id = 'sub_XYZ789'
subscription_status = 'active'  -- active, canceled, past_due
verified = TRUE
```

**Business Rules:**
- Must be "claimed" before upgrading to Top Dog
- Subscription managed via Stripe
- Automatic downgrade to "claimed" on cancellation
- Photos and content remain after downgrade (but not displayed)
- 30-day money-back guarantee
- Can switch monthly ↔ annual (prorated)

**Subscription Lifecycle:**
1. **Signup:** User clicks "Become a Top Dog" → Stripe Checkout
2. **Activation:** Webhook receives `checkout.session.completed` → tier upgraded
3. **Active:** User accesses premium features, subscription auto-renews
4. **Cancellation:** User cancels → webhook receives `customer.subscription.deleted` → tier downgraded
5. **Post-Cancellation:** User retains claimed tier, can resubscribe anytime

**User Experience:**
- Listing appears first in search results
- Large "⭐ TOP DOG" badge on card and listing page
- Photo gallery prominently displayed
- Special offers highlighted
- Dashboard shows advanced analytics
- Stripe Customer Portal link for subscription management

**Marketing Positioning:**
- "Get 5x more clicks than standard listings"
- "Dominate local search for dog daycare"
- "Just $3.30/day to grow your business"
- "Save $198/year with annual plan"

---

## 5. Core Features

### 5.1 Homepage (`/`)

**Purpose:** Introduction, value proposition, drive to search

**Sections:**
1. **Hero:**
   - Headline: "Find the Perfect Dog Daycare in the Bay Area 🐕"
   - Subheading: "6,837+ verified daycares across 90+ cities"
   - Primary CTA: "Find Daycare Near You" → `/search`
   - Secondary CTA: "For Business Owners" → `/pricing`

2. **Limited Time Banner (Temporary):**
   - "⏰ Free listings for first 100 businesses. Premium coming soon!"
   - Green gradient background
   - High visibility placement

3. **How It Works:**
   - Step 1: Search by city or name
   - Step 2: Compare ratings and reviews
   - Step 3: Visit business websites directly
   - Visual: Icon-based flow diagram

4. **Features Grid:**
   - "Verified Listings" - Google Maps data
   - "Comprehensive Coverage" - 90+ cities
   - "Easy Comparison" - Filter by rating, reviews, city
   - "Direct Contact" - Visit websites, not middlemen

5. **For Business Owners:**
   - Headline: "Claim Your Free Listing Today"
   - Benefits: Enhanced visibility, contact info, dashboard
   - CTA: "Claim Your Business" → `/claim`
   - CTA: "See Premium Features" → `/pricing`

6. **Footer:**
   - Links: About, Contact, Privacy, Terms
   - Social media icons (future)
   - Copyright notice

**Design:**
- Gradient backgrounds (orange → pink → yellow)
- Large, bold typography
- High-contrast CTAs (orange buttons)
- Mobile-responsive (stack on small screens)
- Fast loading (<1s LCP)

### 5.2 Search/Directory Page (`/search`)

**Purpose:** Find and filter dog daycares

**Layout:**
- Sidebar: Filters (sticky on desktop)
- Main content: Search results grid
- Top bar: Search input, sort dropdown, results count

**Filters:**
1. **Text Search:**
   - Placeholder: "Search by business name or address..."
   - Real-time filtering (debounced 300ms)
   - Matches: name, address, city
   - Clear button

2. **City Filter:**
   - Dropdown with 90+ Bay Area cities
   - Alphabetically sorted
   - "All Cities" default option
   - Search within dropdown (future)

3. **Business Type Filter:**
   - Checkboxes: Dog daycare, Boarding, Grooming, Training, etc.
   - Multi-select
   - Extracted from google_categories field

4. **Minimum Rating:**
   - Slider: 0-5 stars
   - Only shows listings with ratings ≥ selected value
   - Shows count of filtered results

**Sort Options:**
1. **Rating (High to Low)** - Default
2. **Review Count (Most Reviews)**
3. **Name (A-Z)**
4. **Tier (Top Dog first)** - When Top Dog listings exist

**Results Display:**
- Card-based grid (3 columns on desktop, 1 on mobile)
- Each card shows:
  - Business name
  - City
  - ⭐ Rating (5-star visualization)
  - Review count (e.g., "142 reviews")
  - Phone number (clickable tel: link)
  - Website link (if claimed or Top Dog)
  - "⭐ TOP DOG" badge (if Top Dog tier)
  - "Claimed & Verified" badge (if claimed tier)
  - Google Maps attribution: "Rating from Google Maps"

**Pagination:**
- Initial load: 50 results
- "Load More" button (loads +50)
- Total results counter: "Showing 50 of 324 results"
- Scroll to top on load more (smooth scroll)

**Empty States:**
- No results: "No daycares found. Try adjusting filters."
- No listings in city: "No listings in [city] yet. Check back soon!"

**Performance:**
- Server-side filtering (SQL queries)
- Debounced search input
- Optimistic UI updates
- Image lazy loading

**SEO:**
- Title: "Dog Daycare in [City] | Woof Spots - Find the Best Daycare"
- Meta description: "Browse [count] verified dog daycares in [city], CA. Compare ratings, reviews, and prices. Find the perfect daycare for your pup."
- Canonical URL
- Open Graph tags

### 5.3 Listing Page (`/listing/[id]`)

**Purpose:** Detailed business information, drive conversions

**Sections:**

1. **Header:**
   - Business name (H1)
   - ⭐ TOP DOG badge (if applicable)
   - "Claimed & Verified" badge (if applicable)
   - City, State
   - Star rating + review count
   - Share button (future)

2. **Primary CTA:**
   - **If Top Dog or Claimed:** "Visit Official Website" (large orange button)
   - **If Unclaimed:** "View on Google Maps" (secondary styling)

3. **Quick Info Cards:**
   - Phone: Clickable tel: link
   - Address: Full street address
   - Hours: Today's hours + "See all hours" dropdown
   - Website: Domain display (if claimed/Top Dog)

4. **Photo Gallery (Top Dog Only):**
   - Grid of up to 20 custom photos
   - Lightbox on click
   - Responsive grid (3 cols desktop, 2 cols tablet, 1 col mobile)

5. **Business Description (Top Dog/Claimed):**
   - Custom owner-written description
   - 500-word limit
   - Markdown support (future)

6. **Special Offers (Top Dog Only):**
   - Highlighted cards
   - "New Client Special: 20% off first week!"
   - Expiration dates
   - CTA buttons

7. **Business Details:**
   - Full week hours (expandable table)
   - Service options: Online appointments, contactless, etc.
   - Accessibility: Wheelchair accessible, etc.
   - Amenities: Outdoor play, grooming, training, etc.

8. **Ratings & Reviews:**
   - Star rating (large display)
   - Review count
   - "Read reviews on Google Maps" link
   - Attribution: "Reviews from Google Maps"

9. **Map Embed (Future):**
   - Interactive map showing location
   - "Get Directions" link

10. **Owner Actions (If Claimed/Logged In):**
    - "Edit Listing" button → Dashboard
    - "Upgrade to Top Dog" CTA (if claimed)

11. **Claim CTA (If Unclaimed & Not Logged In):**
    - Large banner: "Is this your business? Claim it for free!"
    - CTA: "Claim This Business" → `/claim?id=[id]`

**Business Rules:**
- Unclaimed listings: Minimal info, strong claim CTA
- Claimed listings: Full contact info, website link
- Top Dog listings: Priority content placement, photos, offers

**Conversion Tracking (Future):**
- Log "website_click" event
- Log "phone_click" event
- Log "directions_click" event
- Show in business owner analytics dashboard

**SEO:**
- Title: "[Business Name] - Dog Daycare in [City] | Woof Spots"
- Meta description: "[Business Name] in [City], CA. Rated [rating] stars ([review_count] reviews). [First 150 chars of description]."
- Structured data (JSON-LD):
  ```json
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "[Business Name]",
    "address": {...},
    "telephone": "[Phone]",
    "url": "[Website]",
    "aggregateRating": {...}
  }
  ```

### 5.4 Pricing Page (`/pricing`)

**Purpose:** Explain Top Dog benefits, drive subscriptions

**URL:** `/pricing?id=[daycare_id]` (optional listing ID for direct upgrade)

**Sections:**

1. **Hero:**
   - Badge: "⭐ TOP DOG PLANS"
   - Headline: "Become a Top Dog 🐕"
   - Subheading: "Get featured at the top of search results, attract more customers, and grow your business with premium tools built for success."

2. **Limited Time Banner:**
   - Same as homepage (consistency)

3. **Pricing Cards (Side-by-Side):**

   **Monthly Plan:**
   - $99/month
   - "Perfect for getting started"
   - Features list:
     - Priority placement in search results
     - Photo gallery (up to 20 photos)
     - Special offers & promotions
     - Enhanced analytics dashboard
     - Contact form integration
     - Business hours editor
     - Custom business description
     - Top Dog badge
   - CTA: "Become a Top Dog"

   **Annual Plan (Featured):**
   - $990/year
   - "BEST VALUE - SAVE $198" badge
   - Strikethrough: $1,188
   - Save badge: "Save $198"
   - "2 months free - our best deal!"
   - Features list:
     - Everything in Monthly
     - Save $198/year (2 months free)
     - Priority support
     - Early access to new features
   - CTA: "Become a Top Dog - Save $198"
   - Highlighted with gradient background, larger scale

4. **Features Grid:**
   - 6 cards with icons + descriptions:
     - 📸 Photo Gallery
     - 📊 Advanced Analytics
     - 🎁 Unlimited Promotions
     - ⭐ Priority Placement
     - ✏️ Full Control
     - 🚀 Enhanced Visibility

5. **FAQ Section:**
   - Can I cancel anytime? (Yes, 30-day guarantee)
   - Do you offer refunds? (Yes, 30 days)
   - Can I switch plans? (Yes, prorated)
   - Do I need to claim first? (Yes, free claim required)

6. **CTA Section:**
   - Headline: "Ready to Grow Your Business?"
   - Subheading: "Join hundreds of dog care businesses..."
   - CTA: "Create Free Account" → `/register`
   - CTA: "Claim Your Business" → `/claim`

**Subscription Flow:**
1. User clicks "Become a Top Dog" button
2. System checks for `?id=` parameter in URL
3. If no ID: Show error "Please select a listing first"
4. If ID exists: POST to `/api/subscriptions/create-checkout`
5. API creates Stripe Checkout session
6. User redirected to Stripe Checkout
7. User completes payment
8. Stripe redirects to `/listing/[id]?upgrade=success`
9. Webhook processes subscription, upgrades tier
10. User sees "✅ You're now a Top Dog!" message

**SEO:**
- Title: "Top Dog Pricing - Premium Dog Daycare Listing | Woof Spots"
- Meta description: "Become a Top Dog for $99/month. Get priority placement, photo gallery, analytics, and more. Save $198 with annual plan."

---

## 6. Premium Features (Top Dog)

### 6.1 Photo Gallery

**Specification:**
- **Limit:** Up to 20 photos per listing
- **Format:** JPEG, PNG, WebP
- **Max File Size:** 5MB per image
- **Minimum Dimensions:** 800x600px
- **Recommended:** 1200x800px or higher

**Upload Process (Future Implementation):**
1. User navigates to Dashboard → Photos
2. Clicks "Upload Photos" button
3. File picker (multi-select)
4. Client-side validation (size, format, dimensions)
5. Upload to cloud storage (S3 or Cloudinary)
6. Generate thumbnails (400px, 800px, 1200px)
7. Save URLs to database (photos JSONB field)
8. Display in photo manager (drag to reorder)

**Display:**
- Listing page: 3-column grid (responsive)
- Lightbox on click (full-screen viewer)
- Image optimization: next/image with srcset

**Database Schema:**
```sql
photos JSONB DEFAULT '[]'::jsonb
-- Example:
-- [
--   {
--     "id": "uuid",
--     "url": "https://cdn.example.com/photos/abc.jpg",
--     "thumbnail": "https://cdn.example.com/photos/abc-thumb.jpg",
--     "caption": "Outdoor play area",
--     "order": 0
--   }
-- ]
```

**Business Rules:**
- Only Top Dog listings can upload photos
- Photos persist after downgrade (but not displayed)
- User can delete/reorder photos anytime
- Admin moderation for inappropriate content (future)

### 6.2 Priority Placement

**Algorithm:**
```sql
-- Search query with tier-based sorting
SELECT * FROM dog_daycares
WHERE city = $1 AND tier != 'unclaimed'
ORDER BY
  CASE tier
    WHEN 'top_dog' THEN 1
    WHEN 'claimed' THEN 2
    ELSE 3
  END,
  rating DESC NULLS LAST,
  review_count DESC NULLS LAST,
  name ASC
LIMIT 50;
```

**Visual Indication:**
- Top Dog listings show "⭐ TOP DOG" badge
- Highlighted card border (subtle gradient)
- Featured section at top of search results (future)

**Performance:**
- Indexed on tier: `CREATE INDEX idx_daycares_tier ON dog_daycares(tier);`
- Compound index: `CREATE INDEX idx_daycares_tier_rating ON dog_daycares(tier DESC, rating DESC, review_count DESC);`

### 6.3 Special Offers & Promotions

**Feature Specification (Future):**
- Create unlimited special offers
- Display on listing page (highlighted card)
- Examples:
  - "New Client Special: 20% off first week!"
  - "Refer a friend, get $50 credit"
  - "Summer camp enrollment - early bird discount"

**Database Schema (Future):**
```sql
CREATE TABLE special_offers (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER REFERENCES dog_daycares(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(50), -- percentage, dollar, free_trial
  discount_value DECIMAL,
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Management Interface:**
- Dashboard → Promotions
- "Create New Offer" button
- Form: Title, description, discount type, dates
- Preview before publishing
- Edit/delete existing offers

### 6.4 Enhanced Analytics Dashboard

**Metrics Tracked (Future Implementation):**

**Page Views:**
- Daily, weekly, monthly graphs
- Unique vs. returning visitors
- Traffic sources (direct, search, referral)

**Engagement:**
- Time on page
- Bounce rate
- Scroll depth

**Conversions:**
- Website clicks (primary conversion)
- Phone clicks
- Direction requests
- Contact form submissions

**Competitive Insights:**
- Your ranking in city
- Average rating in city
- Top competitors

**Database Schema (Future):**
```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER REFERENCES dog_daycares(id),
  event_type VARCHAR(50), -- page_view, website_click, phone_click, etc.
  user_id VARCHAR(255), -- Anonymous ID (cookie)
  session_id VARCHAR(255),
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45), -- Anonymized
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_daycare_date ON analytics_events(daycare_id, created_at);
```

**Dashboard UI:**
- Chart.js or Recharts for visualizations
- Date range selector (7d, 30d, 90d, all time)
- Export to CSV button
- Email reports (weekly digest)

### 6.5 Contact Form Integration

**Feature (Future):**
- Embedded contact form on listing page
- Fields: Name, email, phone, message
- Sends email to business owner
- Logs submission in analytics

**Spam Protection:**
- reCAPTCHA v3
- Rate limiting (max 5 submissions/hour per IP)
- Honeypot field

**Email Template:**
```
Subject: New inquiry from Woof Spots

Hi [Business Name],

You received a new inquiry from Woof Spots:

Name: [Name]
Email: [Email]
Phone: [Phone]

Message:
[Message]

Reply directly to this email to connect with the customer.

---
Manage your Woof Spots listing: https://woofspots.com/dashboard
```

---

## 7. Data Model

### 7.1 Database Schema - `dog_daycares` Table

**Full Schema:**
```sql
CREATE TABLE dog_daycares (
  -- Primary Key
  id SERIAL PRIMARY KEY,

  -- Core Business Info
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) DEFAULT 'bay-area',
  address TEXT,
  phone VARCHAR(50),
  website TEXT,
  google_maps_url TEXT,

  -- Ratings & Reviews
  rating DECIMAL(2,1),              -- 0.0-5.0
  review_count INTEGER DEFAULT 0,
  price_level INTEGER,               -- 1-4 ($ to $$$$)

  -- Google Maps Enhanced Data
  business_hours JSONB,              -- {"monday": "9 AM-6 PM", ...}
  business_status VARCHAR(50),       -- 'open', 'temporarily_closed', 'permanently_closed'
  google_categories JSONB,           -- ["Dog day care center", "Pet boarding service"]
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  place_id VARCHAR(255) UNIQUE,      -- Google's unique identifier
  service_options JSONB,             -- {online_appointments: true, contactless: false, ...}
  wheelchair_accessible BOOLEAN,
  amenities JSONB,                   -- {outdoor_play: true, grooming: true, ...}
  photos JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  years_in_business INTEGER,
  scraped_at TIMESTAMP,              -- Last Google Maps scrape

  -- Three-Tier System
  tier listing_tier DEFAULT 'unclaimed', -- ENUM: unclaimed, claimed, top_dog

  -- Claim Info
  claimed_at TIMESTAMP,
  claimed_by_email TEXT,
  claimed_by_name TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verification_method VARCHAR(50),   -- 'email', 'phone', 'document'

  -- Top Dog Subscription
  top_dog_since TIMESTAMP,           -- When Top Dog started
  top_dog_until TIMESTAMP,           -- NULL = monthly (managed by Stripe), DATE = annual expiry
  stripe_customer_id TEXT,           -- Stripe customer ID
  stripe_subscription_id TEXT,       -- Stripe subscription ID
  subscription_status TEXT,          -- 'active', 'canceled', 'past_due', 'trialing'

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Constraints
  CONSTRAINT unique_name_city UNIQUE(name, city)
);

-- Indexes
CREATE INDEX idx_dog_daycares_city ON dog_daycares(city);
CREATE INDEX idx_dog_daycares_region ON dog_daycares(region);
CREATE INDEX idx_dog_daycares_place_id ON dog_daycares(place_id);
CREATE INDEX idx_dog_daycares_tier ON dog_daycares(tier);
CREATE INDEX idx_dog_daycares_tier_rating ON dog_daycares(tier DESC, rating DESC NULLS LAST, review_count DESC NULLS LAST);
CREATE INDEX idx_dog_daycares_coordinates ON dog_daycares(latitude, longitude);
CREATE INDEX idx_dog_daycares_stripe_customer ON dog_daycares(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;
CREATE INDEX idx_dog_daycares_top_dog_until ON dog_daycares(top_dog_until) WHERE tier = 'top_dog';

-- Comments
COMMENT ON COLUMN dog_daycares.tier IS 'Listing tier: unclaimed (default, limited), claimed (free, verified), top_dog (paid, premium)';
COMMENT ON COLUMN dog_daycares.claimed_at IS 'Timestamp when business owner claimed listing';
COMMENT ON COLUMN dog_daycares.top_dog_since IS 'Timestamp when Top Dog subscription started';
COMMENT ON COLUMN dog_daycares.top_dog_until IS 'Expiry for annual subscriptions (NULL = active monthly)';
COMMENT ON COLUMN dog_daycares.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN dog_daycares.subscription_status IS 'Stripe subscription status';
```

### 7.2 Database Schema - `users` Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL, -- bcrypt hash
  name VARCHAR(255),
  phone VARCHAR(50),

  -- Authentication
  email_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  verification_token_expires TIMESTAMP,
  reset_token VARCHAR(255),
  reset_token_expires TIMESTAMP,

  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
```

### 7.3 Database Functions

**Function: `is_top_dog_active(daycare_id INTEGER)`**
```sql
CREATE OR REPLACE FUNCTION is_top_dog_active(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  tier_val listing_tier;
  expiry_date TIMESTAMP;
BEGIN
  SELECT tier, top_dog_until INTO tier_val, expiry_date
  FROM dog_daycares
  WHERE id = daycare_id;

  IF tier_val = 'top_dog' THEN
    -- NULL = monthly (active), DATE = check if future
    RETURN (expiry_date IS NULL OR expiry_date > NOW());
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;
```

**Function: `claim_listing(daycare_id, owner_email, owner_name)`**
```sql
CREATE OR REPLACE FUNCTION claim_listing(
  daycare_id INTEGER,
  owner_email TEXT,
  owner_name TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    tier = 'claimed',
    claimed_at = NOW(),
    claimed_by_email = owner_email,
    claimed_by_name = owner_name,
    verified = TRUE,
    verification_method = 'email',
    updated_at = NOW()
  WHERE id = daycare_id AND tier = 'unclaimed';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

**Function: `upgrade_to_top_dog(daycare_id, customer_id, subscription_id, is_annual)`**
```sql
CREATE OR REPLACE FUNCTION upgrade_to_top_dog(
  daycare_id INTEGER,
  customer_id TEXT,
  subscription_id TEXT,
  is_annual BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN AS $$
DECLARE
  expiry_date TIMESTAMP;
BEGIN
  IF is_annual THEN
    expiry_date := NOW() + INTERVAL '1 year';
  ELSE
    expiry_date := NULL; -- Monthly managed by Stripe
  END IF;

  UPDATE dog_daycares
  SET
    tier = 'top_dog',
    top_dog_since = NOW(),
    top_dog_until = expiry_date,
    stripe_customer_id = customer_id,
    stripe_subscription_id = subscription_id,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE id = daycare_id AND tier IN ('unclaimed', 'claimed');

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

**Function: `downgrade_from_top_dog(daycare_id)`**
```sql
CREATE OR REPLACE FUNCTION downgrade_from_top_dog(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    tier = 'claimed', -- Downgrade to claimed, NOT unclaimed
    subscription_status = 'canceled',
    updated_at = NOW()
  WHERE id = daycare_id AND tier = 'top_dog';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;
```

### 7.4 Database View - Top Dog Summary

```sql
CREATE OR REPLACE VIEW top_dog_listings_summary AS
SELECT
  id,
  name,
  city,
  state,
  tier,
  claimed_at,
  claimed_by_email,
  top_dog_since,
  top_dog_until,
  subscription_status,
  stripe_customer_id,
  stripe_subscription_id,
  CASE
    WHEN tier = 'top_dog' AND (top_dog_until IS NULL OR top_dog_until > NOW()) THEN 'Active'
    WHEN tier = 'top_dog' AND top_dog_until <= NOW() THEN 'Expired'
    WHEN tier = 'claimed' THEN 'Free Claimed'
    ELSE 'Unclaimed'
  END AS status_display,
  CASE
    WHEN top_dog_until IS NULL THEN 'Monthly ($99/mo)'
    ELSE 'Annual ($990/yr)'
  END AS plan_type,
  CASE
    WHEN tier = 'top_dog' THEN 99 * 12 -- Monthly = $1,188/yr
    WHEN tier = 'top_dog' AND top_dog_until IS NOT NULL THEN 990 -- Annual = $990/yr
    ELSE 0
  END AS annual_revenue_value
FROM dog_daycares
WHERE tier IN ('claimed', 'top_dog')
ORDER BY tier DESC, top_dog_since DESC NULLS LAST;

COMMENT ON VIEW top_dog_listings_summary IS 'Dashboard view of all claimed and Top Dog listings with revenue projections';
```

---

## 8. API Endpoints

### 8.1 Authentication API

**POST `/api/auth/register`**
```typescript
// Request
{
  email: string;
  password: string; // Min 8 chars
  name: string;
}

// Response (Success)
{
  success: true;
  message: "Account created successfully";
  user: {
    id: number;
    email: string;
    name: string;
  }
}

// Response (Error)
{
  success: false;
  error: "Email already exists"
}
```

**POST `/api/auth/login`**
```typescript
// Request
{
  email: string;
  password: string;
}

// Response (Success)
{
  success: true;
  message: "Logged in successfully";
  token: string; // JWT token (httpOnly cookie)
  user: {
    id: number;
    email: string;
    name: string;
  }
}

// Response (Error)
{
  success: false;
  error: "Invalid credentials"
}
```

**GET `/api/auth/me`**
```typescript
// Headers: Cookie with JWT token

// Response (Authenticated)
{
  success: true;
  user: {
    id: number;
    email: string;
    name: string;
    email_verified: boolean;
  }
}

// Response (Unauthenticated)
{
  success: false;
  error: "Unauthorized"
}
```

**POST `/api/auth/logout`**
```typescript
// Response
{
  success: true;
  message: "Logged out successfully"
}
```

### 8.2 Listings API

**GET `/api/daycares`**
```typescript
// Query Parameters
{
  search?: string;        // Text search
  city?: string;          // Filter by city
  businessType?: string;  // Filter by google_categories
  minRating?: number;     // Minimum rating (0-5)
  sort?: 'rating' | 'reviews' | 'name' | 'tier';
  limit?: number;         // Default: 50
  offset?: number;        // Default: 0
}

// Response
{
  success: true;
  data: [
    {
      id: number;
      name: string;
      city: string;
      address: string;
      phone: string;
      website: string | null;
      rating: number;
      review_count: number;
      tier: 'unclaimed' | 'claimed' | 'top_dog';
      google_maps_url: string;
    }
  ];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }
}
```

**GET `/api/daycares/[id]`**
```typescript
// Response
{
  success: true;
  data: {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    website: string | null;
    rating: number;
    review_count: number;
    tier: 'unclaimed' | 'claimed' | 'top_dog';
    business_hours: Record<string, string>;
    google_categories: string[];
    service_options: Record<string, boolean>;
    amenities: Record<string, boolean>;
    photos: Array<{url: string; caption?: string}>;
    // ... other fields
  }
}
```

### 8.3 Claims API (Future)

**POST `/api/claims`**
```typescript
// Headers: Authorization (JWT)
// Request
{
  daycareId: number;
}

// Response
{
  success: true;
  message: "Claim submitted. Check your email for verification."
}
```

### 8.4 Subscriptions API

**POST `/api/subscriptions/create-checkout`**
```typescript
// Request
{
  daycareId: number;
  plan: 'MONTHLY' | 'ANNUAL';
  email?: string; // Optional, uses claimed_by_email if not provided
}

// Response
{
  success: true;
  data: {
    sessionId: string;  // Stripe Checkout session ID
    url: string;        // Redirect URL to Stripe Checkout
  }
}

// Business Logic
1. Verify listing exists and is claimed
2. Get or create Stripe customer
3. Create Stripe Checkout session with metadata:
   - daycareId
   - plan (MONTHLY or ANNUAL)
4. Return session URL for redirect
```

**POST `/api/subscriptions/webhook`** (Stripe Webhooks)
```typescript
// Headers: stripe-signature (Stripe signature for verification)

// Handles these events:
- checkout.session.completed → Upgrade to Top Dog
- customer.subscription.updated → Update subscription status
- customer.subscription.deleted → Downgrade to claimed
- invoice.payment_failed → Mark subscription past_due
- invoice.payment_succeeded → Confirm active status

// Implementation
1. Verify Stripe signature
2. Parse event type
3. Execute database function (upgrade_to_top_dog, downgrade_from_top_dog)
4. Log event
5. Return 200 OK
```

**GET `/api/subscriptions/portal`** (Future)
```typescript
// Creates Stripe Customer Portal session for subscription management

// Response
{
  success: true;
  url: string; // Redirect to Stripe Customer Portal
}
```

---

## 9. User Experience

### 9.1 User Flows

**Flow 1: Pet Owner Finding Daycare**
```
1. Land on homepage (/)
2. Click "Find Daycare Near You" → /search
3. Filter by city: "Oakland"
4. Filter by minimum rating: 4.5 stars
5. Browse results (Top Dog listings appear first)
6. Click on listing card → /listing/123
7. Read details, view photos (if Top Dog)
8. Click "Visit Official Website" → Business site
   OR
   Click "Call Now" → tel: link
```

**Flow 2: Business Owner Claiming Listing**
```
1. Hear about Woof Spots (marketing, search, referral)
2. Navigate to homepage → Click "Claim Your Business"
3. Register account: /register
   - Enter email, password, name
   - Submit form
   - Account created, JWT cookie set
4. Search for business: /claim
   - Enter business name
   - Select from results
5. Claim listing (backend):
   - POST /api/claims with daycareId
   - Database: claim_listing(id, email, name)
   - Tier upgraded: unclaimed → claimed
6. Redirect to /dashboard
7. See "✅ Listing claimed successfully!"
8. Dashboard shows:
   - Listing details (editable)
   - Basic analytics
   - "Upgrade to Top Dog" CTA
```

**Flow 3: Upgrading to Top Dog**
```
1. Business owner logs in → /dashboard
2. Sees banner: "Upgrade to Top Dog for 5x more visibility"
3. Clicks "Upgrade Now" → /pricing?id=123
4. Reviews features and pricing
5. Selects "Annual" plan (save $198)
6. Clicks "Become a Top Dog - Save $198"
7. JavaScript: POST /api/subscriptions/create-checkout
   - daycareId: 123
   - plan: ANNUAL
8. API creates Stripe Checkout session
9. Redirect to Stripe Checkout (hosted)
10. User enters payment details
11. User completes checkout
12. Stripe redirects to /listing/123?upgrade=success
13. Webhook (async):
    - Stripe sends checkout.session.completed
    - API calls upgrade_to_top_dog(123, customer_id, sub_id, true)
    - Database: tier = 'top_dog', subscription_status = 'active'
14. User sees: "✅ You're now a Top Dog! Your listing is live."
15. User navigates to /dashboard
16. Dashboard shows:
    - Top Dog features unlocked
    - "Upload Photos" button
    - "Create Special Offer" button
    - Enhanced analytics graphs
```

**Flow 4: Subscription Cancellation**
```
1. User logs in → /dashboard
2. Clicks "Manage Subscription"
3. Redirects to Stripe Customer Portal
4. User clicks "Cancel Subscription"
5. Stripe processes cancellation
6. Webhook:
   - Stripe sends customer.subscription.deleted
   - API calls downgrade_from_top_dog(123)
   - Database: tier = 'claimed', subscription_status = 'canceled'
7. User returns to /dashboard
8. Sees message: "Subscription canceled. You're now on the Claimed (free) tier."
9. Top Dog features disabled:
   - Photos no longer visible on listing page
   - No priority placement
   - No special offers displayed
10. User can resubscribe anytime
```

### 9.2 Responsive Design

**Breakpoints:**
```css
/* Mobile */
@media (max-width: 640px) {
  /* Single column layout */
  /* Stack filters */
  /* Full-width CTAs */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* 2-column grid */
  /* Sidebar filters (collapsible) */
}

/* Desktop */
@media (min-width: 1025px) {
  /* 3-column grid */
  /* Sticky sidebar filters */
  /* Hover states */
}
```

**Mobile Optimizations:**
- Touch-friendly buttons (min 44px height)
- Swipe gestures for photo galleries
- Bottom-fixed CTAs on listing pages
- Collapsible filters (accordion)
- Hamburger menu navigation

**Performance Targets:**
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Cumulative Layout Shift (CLS): <0.1
- Time to Interactive (TTI): <3.5s

---

## 10. Authentication & Authorization

### 10.1 Authentication System

**Technology:**
- JWT (JSON Web Tokens)
- httpOnly cookies (prevents XSS attacks)
- Secure flag (HTTPS only)
- SameSite: Lax (CSRF protection)

**Password Security:**
- bcrypt hashing (salt rounds: 10)
- Minimum length: 8 characters
- No password complexity requirements (research shows they reduce security)
- Password reset via email token (24-hour expiry)

**Session Management:**
- Token expiry: 7 days
- Refresh token: 30 days (future)
- Logout: Clear cookie, no server-side session storage

**Email Verification (Future):**
- Send verification email on registration
- Token expires in 24 hours
- Resend token option
- Required before claiming listing

### 10.2 Authorization Rules

**Public Routes (No Auth):**
- `/` - Homepage
- `/search` - Directory
- `/listing/[id]` - Listing pages
- `/pricing` - Pricing page
- `/login` - Login page
- `/register` - Registration page

**Protected Routes (Auth Required):**
- `/dashboard` - Business owner dashboard
- `/claim` - Claim listing flow
- `/api/claims/*` - Claim endpoints
- `/api/subscriptions/create-checkout` - Checkout (requires claimed listing)

**Route Protection (Middleware):**
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect('/login?redirect=/dashboard');
  }

  return NextResponse.next();
}
```

**API Authorization:**
```typescript
// Example: /api/claims/route.ts
export async function POST(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const user = verifyToken(token);
  // ... process claim
}
```

---

## 11. Payment & Subscription System

### 11.1 Stripe Configuration

**Products:**
1. **Top Dog Monthly**
   - Name: "Top Dog Monthly"
   - Price: $99/month
   - Price ID: `price_1SLX6VCdC4FIQjaIo5aeRF5U` (from env)
   - Billing: Recurring monthly
   - Metadata: `{tier: "top_dog", interval: "monthly"}`

2. **Top Dog Annual**
   - Name: "Top Dog Annual"
   - Price: $990/year
   - Price ID: `price_1SLX76CdC4FIQjaISizP0qg9` (from env)
   - Billing: Recurring annually
   - Metadata: `{tier: "top_dog", interval: "annual", savings: "198"}`

**Customer Management:**
- One Stripe customer per business (not per user)
- Customer ID stored in `dog_daycares.stripe_customer_id`
- Customer metadata: `{daycareId: "123", businessName: "Happy Paws Daycare"}`

**Checkout Configuration:**
```typescript
const session = await stripe.checkout.sessions.create({
  customer: stripeCustomerId,
  payment_method_types: ['card'],
  line_items: [
    {
      price: priceId, // Monthly or Annual
      quantity: 1,
    },
  ],
  mode: 'subscription',
  success_url: `${APP_URL}/listing/${daycareId}?upgrade=success`,
  cancel_url: `${APP_URL}/listing/${daycareId}?upgrade=cancelled`,
  metadata: {
    daycareId: daycareId.toString(),
    plan: 'MONTHLY' | 'ANNUAL',
  },
});
```

### 11.2 Webhook Events

**Endpoint:** `POST /api/subscriptions/webhook`
**Signature Verification:** Required (prevents spoofing)

**Events Handled:**

1. **`checkout.session.completed`**
   - Trigger: User completes payment
   - Action: Upgrade listing to Top Dog
   - Function: `upgrade_to_top_dog(daycareId, customerId, subscriptionId, isAnnual)`
   - Log: "✅ Upgraded daycare 123 to Top Dog"

2. **`customer.subscription.updated`**
   - Trigger: Subscription modified (plan change, pause, etc.)
   - Action: Update `subscription_status` field
   - Examples: 'active', 'trialing', 'past_due'

3. **`customer.subscription.deleted`**
   - Trigger: User cancels subscription (after period ends)
   - Action: Downgrade listing to claimed
   - Function: `downgrade_from_top_dog(daycareId)`
   - Log: "⬇️ Downgraded daycare 123 from Top Dog"

4. **`invoice.payment_succeeded`**
   - Trigger: Successful renewal payment
   - Action: Confirm subscription active, extend period
   - Update: `subscription_status = 'active'`

5. **`invoice.payment_failed`**
   - Trigger: Failed renewal payment
   - Action: Mark subscription past_due
   - Update: `subscription_status = 'past_due'`
   - Future: Send email notification to business owner

**Error Handling:**
```typescript
try {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    WEBHOOK_SECRET
  );

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object);
      break;
    // ... other cases
  }

  return NextResponse.json({ received: true });
} catch (err) {
  console.error('Webhook error:', err.message);
  return NextResponse.json(
    { error: 'Webhook handler failed' },
    { status: 400 }
  );
}
```

### 11.3 Subscription Management

**Customer Portal:**
- Stripe-hosted portal (no custom UI needed)
- Features:
  - Cancel subscription
  - Update payment method
  - View invoices
  - Change plan (monthly ↔ annual)

**Implementation:**
```typescript
// /api/subscriptions/portal
const session = await stripe.billingPortal.sessions.create({
  customer: stripeCustomerId,
  return_url: `${APP_URL}/dashboard`,
});

return NextResponse.json({ url: session.url });
```

**Prorated Billing:**
- Monthly → Annual: Credit unused monthly time
- Annual → Monthly: No refund, takes effect at period end

**Refunds:**
- 30-day money-back guarantee
- Manual process (Stripe Dashboard → Refund)
- Future: Automated refund API

---

## 12. Business Dashboard

### 12.1 Dashboard Overview (`/dashboard`)

**Purpose:** Central hub for business owners to manage listings and subscriptions

**Access Control:**
- Requires authentication (JWT token)
- Shows all listings claimed by user (email match)
- Multi-listing support (future: user can claim multiple businesses)

**Layout:**
```
┌─────────────────────────────────────┐
│ Header: "Your Business Dashboard"  │
│ User: john@example.com [Logout]    │
├─────────────────────────────────────┤
│ Sidebar (Desktop)                   │
│ - Overview                          │
│ - Listings                          │
│ - Analytics (Top Dog only)          │
│ - Photos (Top Dog only)             │
│ - Promotions (Top Dog only)         │
│ - Subscription                      │
│ - Settings                          │
├─────────────────────────────────────┤
│ Main Content                        │
│ [Dynamic based on selected tab]     │
└─────────────────────────────────────┘
```

### 12.2 Dashboard Sections

**Overview Tab:**
- Summary cards:
  - Listing tier (Claimed / Top Dog)
  - Subscription status (if Top Dog)
  - Next billing date
  - Quick stats: Page views (7d), website clicks (7d)
- CTAs:
  - "Upgrade to Top Dog" (if claimed)
  - "Manage Subscription" (if Top Dog)
  - "View Listing" (public listing page)
  - "Edit Listing"

**Listings Tab:**
- Table of all claimed businesses:
  - Name | City | Tier | Actions
  - Actions: View, Edit, Manage Subscription
- "Claim Another Business" button

**Analytics Tab (Top Dog Only):**
- Date range selector (7d, 30d, 90d, all time)
- Charts:
  - Page views over time (line chart)
  - Traffic sources (pie chart)
  - Conversion funnel:
    - Page views → Website clicks → Phone clicks
- Metrics cards:
  - Total page views
  - Unique visitors
  - Website click-through rate
  - Phone click-through rate
- Export to CSV button

**Photos Tab (Top Dog Only):**
- Photo grid (all uploaded photos)
- "Upload Photos" button (max 20)
- Drag-to-reorder functionality
- Delete button on each photo
- Photo preview

**Promotions Tab (Top Dog Only):**
- List of active promotions
- "Create New Promotion" button
- Form:
  - Title (e.g., "New Client Special")
  - Description
  - Discount type: % off, $ off, free trial
  - Valid dates (from/to)
- Edit/delete buttons

**Subscription Tab:**
- Current plan details:
  - Plan: "Top Dog Monthly" or "Top Dog Annual"
  - Price: $99/mo or $990/yr
  - Status: Active, Canceled, Past Due
  - Next billing date
  - Payment method: **** 4242 (Visa)
- CTAs:
  - "Manage Subscription" → Stripe Customer Portal
  - "Upgrade to Annual" (if monthly)
  - "Cancel Subscription"

**Settings Tab:**
- Account info:
  - Email (read-only)
  - Name (editable)
  - Phone (editable)
  - Password change
- Business info:
  - Business name (editable)
  - Address (editable)
  - Website (editable)
  - Business hours (editable)
  - Description (500-word limit)
- Notification preferences (future):
  - Email on new reviews
  - Weekly analytics digest
  - Billing reminders

---

## 13. Data Collection

### 13.1 Enhanced Scraper Architecture

**File:** `packages/scraper/src/enhanced-scraper.js`

**Purpose:** Collect comprehensive dog daycare data from Google Maps

**Process Overview:**
1. Load city list (90+ Bay Area cities)
2. For each city:
   - Open Google Maps in Playwright browser
   - Search: "dog daycare in [city], CA"
   - Scroll results to load all businesses
   - Extract business links
3. For each business:
   - Visit detail page
   - Extract 25+ data points
   - Save to database (upsert)
4. Handle duplicates via `place_id`
5. Rate limit: 2-5 second delays

**Technical Implementation:**

**Anti-Detection Measures:**
```javascript
const browser = await chromium.launch({
  headless: true,
  args: [
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
});

const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  viewport: { width: 1920, height: 1080 },
  locale: 'en-US',
});

await page.addInitScript(() => {
  delete window.navigator.webdriver;
});
```

**Data Extraction:**
```javascript
const businessData = {
  name: await page.textContent('h1.DUwDvf'),
  rating: await page.textContent('span.ceNzKf') || null,
  review_count: extractReviewCount(await page.textContent('span.RDApEe')),
  address: await page.textContent('button[data-item-id="address"]'),
  phone: await page.textContent('button[data-item-id^="phone"]'),
  website: await page.getAttribute('a[data-item-id="authority"]', 'href'),
  business_hours: await extractHours(page),
  google_categories: await extractCategories(page),
  place_id: extractPlaceId(page.url()),
  latitude: extractCoordinate(page.url(), 'lat'),
  longitude: extractCoordinate(page.url(), 'lng'),
  // ... 15+ more fields
};
```

**Database Upsert:**
```javascript
const query = `
  INSERT INTO dog_daycares (
    name, city, address, phone, website, rating, review_count,
    place_id, latitude, longitude, business_hours, google_categories,
    business_status, service_options, amenities, scraped_at
  )
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW())
  ON CONFLICT (place_id)
  DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    rating = EXCLUDED.rating,
    review_count = EXCLUDED.review_count,
    business_hours = EXCLUDED.business_hours,
    business_status = EXCLUDED.business_status,
    scraped_at = NOW(),
    updated_at = NOW()
  WHERE dog_daycares.tier = 'unclaimed';
  -- Only update unclaimed listings (preserve owner edits)
`;
```

### 13.2 Data Quality Standards

**Requirements:**
- ✅ Only save ratings when `review_count > 0`
- ✅ No fake/placeholder data
- ✅ Proper NULL handling for missing fields
- ✅ Deduplication via `place_id`
- ✅ Preserve owner edits (don't overwrite claimed listings)

**Validation:**
```javascript
if (rating && review_count === 0) {
  rating = null; // Don't save ratings without reviews
}

if (!phone || phone === 'N/A') {
  phone = null;
}

if (website && !website.startsWith('http')) {
  website = 'https://' + website;
}
```

### 13.3 Scraping Schedule

**Current:** Manual execution
**Future:** Automated cron jobs

**Proposed Schedule:**
- **Weekly:** Refresh all unclaimed listings (update hours, ratings)
- **Monthly:** Full re-scrape to discover new businesses
- **On-Demand:** Business owner can request immediate refresh

**Cron Implementation (Future):**
```javascript
// Vercel Cron (vercel.json)
{
  "crons": [{
    "path": "/api/cron/refresh-listings",
    "schedule": "0 2 * * 0" // Every Sunday at 2am
  }]
}
```

### 13.4 City Coverage

**Current Coverage:** 90+ cities across 8 Bay Area counties

**City List Sample:**
```javascript
// packages/scraper/cities/bay-area.json
{
  "bay-area": [
    "San Francisco",
    "Oakland",
    "San Jose",
    "Berkeley",
    "Palo Alto",
    "Mountain View",
    "Sunnyvale",
    // ... 83 more cities
  ]
}
```

**Expansion Plan:**
- Q1 2026: Los Angeles Metro (100+ cities)
- Q2 2026: San Diego Metro (50+ cities)
- Q3 2026: Seattle Metro (75+ cities)

---

## 14. Legal & Compliance

### 14.1 Data Usage & Attribution

**Google Maps Data:**
- ✅ Public data aggregation (legally defensible)
- ✅ Clear attribution on every page: "Rating and business information from Google Maps"
- ✅ Direct links to Google Maps for reviews/directions
- ❌ No scraping of user-uploaded photos (use only business-uploaded photos)
- ✅ Regular data refreshes to maintain accuracy
- ✅ Respect robots.txt (Google Maps allows scraping public data)

**Attribution Examples:**
```html
<!-- Listing card -->
<p class="text-xs text-gray-500">
  Rating from Google Maps
</p>

<!-- Listing page -->
<div class="border-t pt-4 mt-4">
  <p class="text-sm text-gray-600">
    Business information and ratings provided by Google Maps.
    <a href="[google_maps_url]" class="text-blue-600 hover:underline">
      View on Google Maps
    </a>
  </p>
</div>
```

### 14.2 Privacy Policy

**Requirements (Future - Legal Review):**
- **User Data Collection:**
  - Email, password (hashed), name, phone
  - Analytics data: IP address (anonymized), user-agent, page views
  - Cookie usage: Authentication cookies (httpOnly, secure)

- **Data Usage:**
  - Account authentication
  - Subscription billing (via Stripe)
  - Analytics for business owners
  - Marketing (with opt-in)

- **Data Sharing:**
  - Stripe (payment processing)
  - No third-party advertising
  - No selling user data

- **User Rights:**
  - Access personal data
  - Delete account (GDPR right to erasure)
  - Export data (JSON format)

**GDPR Compliance (EU Visitors):**
- Cookie consent banner
- Data processing agreement
- Right to access
- Right to deletion
- Data portability

**CCPA Compliance (California):**
- "Do Not Sell My Personal Information" link
- Disclosure of data collection
- Opt-out mechanism

### 14.3 Terms of Service

**Key Sections (Future - Legal Review):**

1. **Service Description:**
   - Directory of dog daycare businesses
   - Three-tier listing system
   - Subscription terms

2. **User Accounts:**
   - Age requirement: 18+
   - Account security (password responsibility)
   - Prohibited activities (false claims, spam, abuse)

3. **Business Listings:**
   - Claim verification required
   - Accurate information requirement
   - Trademark/brand usage guidelines

4. **Payment Terms:**
   - Subscription billing (monthly/annual)
   - Cancellation policy
   - Refund policy (30-day guarantee)
   - Auto-renewal disclosure

5. **Intellectual Property:**
   - User-uploaded content license (photos, descriptions)
   - Woof Spots trademark
   - Third-party content (Google Maps attribution)

6. **Limitation of Liability:**
   - No warranties on listing accuracy
   - No liability for third-party services
   - Indemnification clause

### 14.4 Business Verification

**Current Process:**
- Email verification only
- User must provide email matching business domain (future)

**Future Enhancements:**
1. **Email Domain Verification:**
   - Require email from business domain (e.g., owner@happypaws.com)
   - Verify domain ownership

2. **Phone Verification:**
   - SMS code to business phone number
   - Must match Google Maps listing

3. **Document Verification:**
   - Upload business license
   - Manual review by admin

4. **Dispute Resolution:**
   - DMCA takedown process for false claims
   - Manual review within 5 business days
   - Evidence requirement (business documents)

---

## 15. Growth Strategy

### 15.1 SEO Optimization

**On-Page SEO:**

**Meta Tags Template:**
```html
<!-- Homepage -->
<title>Find Dog Daycare in the Bay Area | Woof Spots - 6,837+ Verified Daycares</title>
<meta name="description" content="Discover the best dog daycare in the San Francisco Bay Area. Browse 6,837+ verified daycares across 90+ cities. Compare ratings, reviews, and prices.">

<!-- Search Page -->
<title>Dog Daycare in {city} | Woof Spots - Best Daycares in {city}, CA</title>
<meta name="description" content="Find the best dog daycare in {city}, California. Browse {count} verified daycares with real ratings and reviews from Google Maps.">

<!-- Listing Page -->
<title>{business_name} - Dog Daycare in {city} | Woof Spots</title>
<meta name="description" content="{business_name} in {city}, CA. Rated {rating} stars ({review_count} reviews). {first_150_chars_of_description}.">
```

**Structured Data (JSON-LD):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{business_name}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{street_address}",
    "addressLocality": "{city}",
    "addressRegion": "CA",
    "postalCode": "{zip}"
  },
  "telephone": "{phone}",
  "url": "{website}",
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{rating}",
    "reviewCount": "{review_count}"
  },
  "openingHours": [
    "Mo-Fr 07:00-19:00",
    "Sa 09:00-17:00"
  ]
}
</script>
```

**Open Graph Tags:**
```html
<meta property="og:title" content="{business_name} - Dog Daycare in {city}">
<meta property="og:description" content="Rated {rating} stars with {review_count} reviews.">
<meta property="og:image" content="{first_photo_url}">
<meta property="og:url" content="https://woofspots.com/listing/{id}">
<meta property="og:type" content="business.business">
```

**Technical SEO:**
- ✅ Next.js App Router (automatic SSR)
- ✅ Vercel Edge Network (global CDN)
- ✅ Fast page loads (<2.5s LCP)
- ✅ Mobile-responsive (100% mobile score)
- ✅ Clean URL structure (`/listing/123`, not `/listing?id=123`)
- 🔄 XML Sitemap generation (future)
- 🔄 robots.txt optimization (future)

**Internal Linking:**
- Homepage → City landing pages
- City pages → Individual listings
- Listing pages → Related businesses (same city)
- Footer → All city pages

### 15.2 Content Strategy

**City Landing Pages (Future):**
```
URL: /dog-daycare-{city-slug}
Title: "Dog Daycare in {City}, CA - Best Daycares in {City} | Woof Spots"

Content:
- Introduction: "Looking for dog daycare in {City}? Browse {count} verified daycares..."
- Featured Top Dog listings (top 3)
- All listings in city (grid)
- FAQ: "How much does dog daycare cost in {City}?"
- Neighborhood breakdown (if applicable)
```

**Blog Content (Future):**
- "How to Choose the Best Dog Daycare" (SEO: "how to choose dog daycare")
- "Dog Daycare vs. Dog Walker: Which is Right for You?"
- "What to Look for in a Dog Daycare Facility"
- "{City} Dog Daycare Guide: Neighborhoods, Prices, and More"

**User-Generated Content (Future):**
- Review system (separate from Google)
- Photo submissions from customers
- Q&A section on listing pages

### 15.3 Marketing Channels

**Organic Channels:**
1. **SEO (Primary Driver):**
   - Target: 10,000 organic visitors/month by Q2 2026
   - Keywords: "{city} dog daycare", "best dog daycare {city}", "dog daycare near me"
   - Long-tail: "{neighborhood} dog daycare", "dog daycare {city} prices"

2. **Social Media:**
   - Instagram: Pet-friendly content, featured businesses, dog care tips
   - Facebook: Local community groups, business owner testimonials
   - Pinterest: Visual content (facility photos, dog care infographics)

3. **Partnerships:**
   - Pet supply stores (cross-promotion)
   - Veterinary clinics (referral program)
   - Dog trainers (content collaboration)
   - Local pet events (sponsorships)

**Paid Channels:**
1. **Google Ads:**
   - High-intent keywords: "dog daycare near me", "{city} dog daycare"
   - Budget: $1,000-2,000/month
   - Target CPC: $2-5
   - Expected conversions: 200-400 clicks/month

2. **Facebook/Instagram Ads:**
   - Geo-targeted: Bay Area residents with dogs
   - Lookalike audiences (based on business owners)
   - Budget: $500-1,000/month

3. **Sponsored Content:**
   - Pet blogs (guest posts)
   - Local publications (sponsored articles)

**Direct Outreach:**
1. **Business Owner Emails:**
   - Subject: "Is this your business on Woof Spots?"
   - Offer: Free claim + 30-day Top Dog trial
   - Target: Unclaimed listings with high traffic

2. **Trade Shows:**
   - Global Pet Expo
   - SuperZoo
   - Local chamber of commerce events

3. **Press Releases:**
   - Launch announcement: "New Dog Daycare Directory Launches in Bay Area"
   - Expansion announcements: "Woof Spots Expands to LA"

### 15.4 Conversion Optimization

**Pet Owner Conversions:**
- Goal: Click-through to business website
- Tactics:
  - Prominent "Visit Official Website" CTA
  - Phone number clickable (tel: link)
  - Directions link
  - Photo galleries (Top Dog)
  - Special offers (Top Dog)

**Business Owner Conversions:**
- Goal: Claimed listings → Top Dog subscriptions
- Tactics:
  - Free claim (remove barrier)
  - Show value: "Top Dog listings get 5x more clicks"
  - Social proof: "Join 100+ Top Dog businesses"
  - Urgency: "Limited spots available in {city}"
  - Guarantee: "30-day money-back guarantee"

**A/B Testing Opportunities (Future):**
- Pricing page: Monthly vs. Annual emphasis
- CTA copy: "Upgrade Now" vs. "Become a Top Dog"
- Pricing display: Monthly ($99/mo) vs. Daily ($3.30/day)
- Testimonials: Video vs. Text
- Free trial: 14 days vs. 30 days

---

## 16. Growth Engine: Photo Contest, Newsletter & Social Media

### 16.1 Overview - The Traffic Honeypot Strategy

**Core Strategy:** Use viral photo contest as traffic driver → Convert to newsletter subscribers → Drive directory usage → Business owner conversions

**Funnel:**
```
Social Media Post → Contest Page → Vote/Submit → Newsletter Signup → Directory Browse → Claimed Listing → Top Dog Subscription
```

**Success Metrics:**
- **Month 1:** 50 contest entries, 500 newsletter subscribers, 5,000 site visits
- **Month 3:** 200 entries, 2,000 subscribers, 20,000 visits
- **Month 6:** 500 entries, 10,000 subscribers, 100,000 visits
- **Month 12:** 2,000 entries, 50,000 subscribers, 500,000 visits

---

### 16.2 Photo Contest System

**Purpose:** Viral engagement driver, newsletter growth, social media content

#### Contest Structure

**Monthly Contest Categories:**
- 🤪 Goofiest Face
- 🥴 Biggest Derp
- ✂️ Worst Haircut (grooming disasters)
- 😂 Epic Fail (clumsy moments)
- 🎭 Drama Queen/King (overreacting)
- 😴 Weirdest Sleep Position
- 🤖 AI Dog (AI-generated only)

**Prizes:**
- 🥇 1st Place: $500
- 🥈 2nd Place: $250
- 🥉 3rd Place: $100
- **Total Prize Pool:** $850/month

**Voting Rules:**
- One vote per email per entry
- Email normalization to prevent Gmail + tricks (user+1@gmail.com → user@gmail.com)
- ZIP code required (for metro segmentation)
- Auto-subscribe to newsletter on vote or submission

#### Technical Implementation

**Database Schema:**
```sql
CREATE TABLE contest_submissions (
  id SERIAL PRIMARY KEY,
  dog_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  photo_url TEXT NOT NULL,
  owner_name VARCHAR(255),
  owner_email TEXT NOT NULL,
  owner_zip VARCHAR(10),
  description TEXT,
  votes INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE contest_votes (
  id SERIAL PRIMARY KEY,
  submission_id INTEGER REFERENCES contest_submissions(id),
  voter_email TEXT NOT NULL,
  normalized_email TEXT NOT NULL,
  voter_zip VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(submission_id, normalized_email)
);
```

**File Upload:**
- UploadThing integration for photo uploads
- Max file size: 10MB
- Formats: JPEG, PNG, WebP
- Auto-resize to 1200px max dimension

**Features:**
- `/contest` - Public contest page with voting
- `/admin/contest` - Admin approval/moderation
- Auto opt-in to newsletter on vote/submit
- Vote tracking with localStorage (prevent multiple votes from same browser)
- ZIP code tracking for metro-specific content

#### User Flow

**Submission:**
1. User navigates to `/contest`
2. Clicks "Submit Your Dog"
3. Uploads photo (via UploadThing)
4. Enters: Dog name, category, description, owner info, ZIP
5. Auto-subscribed to newsletter
6. Admin reviews/approves (prevent spam)
7. Entry goes live for voting

**Voting:**
1. Browse contest entries by category
2. Click "Vote" on favorite
3. Enter email + ZIP code
4. Vote recorded (normalized email prevents duplicates)
5. Auto-subscribed to newsletter
6. See updated vote count

**Admin Moderation:**
- Approve/reject submissions
- Remove inappropriate content
- Feature winners in newsletter
- Export data for social media posts

---

### 16.3 Newsletter System

**Purpose:** Build engaged audience, drive repeat traffic, promote Top Dog upgrades

#### Newsletter Features

**Monthly Newsletter Includes:**
1. **Contest Winners** - Top 3 vote-getters with photos
2. **Featured Entries** - 6 funny/popular contest photos
3. **Featured Daycares** - 3 top-rated Top Dog listings
4. **Metro-Specific Content** - City guides, local recommendations (segmented by ZIP)
5. **Custom Message** - Announcements, updates, tips

**Auto Opt-In Sources:**
- Contest voting
- Contest submission
- Manual signup (future: homepage form)

**Email Technology:**
- **Provider:** Resend
- **Templates:** React Email (beautiful, responsive)
- **Sender:** `newsletter@woofspots.com`
- **Subject:** `Woof Spots Monthly - {Month} 🐕`

#### Newsletter Content Strategy

**52-Week Content Plan:** Mixed format to keep fresh

**Q1: Winter (Weeks 1-13)**
- Week 1: San Francisco Bay Area - Top Daycares with Indoor Play
- Week 2: How to Choose a Dog Daycare - Vet-Approved Checklist
- Week 3: Los Angeles - Best Dog Boarding for the Holidays
- Week 4: Winter Safety Tips for Dogs
- Week 5: NYC - 24/7 Dog Care Options in Manhattan
- Week 6: Dog Grooming 101 - How Often to Groom
- Week 7: Seattle - Rainy Day Activities & Indoor Daycares
- Week 8: Bay Area vs SoCal - Regional Price Comparison
- Week 9: Chicago - Best Heated Boarding Facilities
- Week 10: Dog Walking Services - What to Look For
- Week 11: Boston Neighborhoods - Cambridge vs Back Bay
- Week 12: Valentine's Day Special - Treat Your Pup to Spa Day
- Week 13: Austin - Dog-Friendly Patios & Daycare Combos

**Content Types Rotation:**
- Metro Guides (city-specific recommendations)
- How-To Guides (educational service comparisons)
- Seasonal Content (holiday and weather tips)
- Regional Comparisons (multi-city insights)
- Neighborhood Guides (hyperlocal recommendations)

**Metro Segmentation:**
- ZIP code tracking on vote/submit
- Customize featured daycares by metro
- Customize content by region (e.g., "Seattle: Rainy Day Activities")
- Generic version for non-service areas

#### Newsletter Admin Interface

**Access:** `/admin/newsletter`

**Compose Newsletter:**
1. Set month (e.g., "November 2025")
2. Add custom message (optional)
3. Preview auto-selected content:
   - Top 3 contest winners (auto-selected by votes)
   - Next 6 featured entries (auto-selected)
   - Top 3 daycares (4.5+ stars, Top Dog preferred)
4. Preview rendered email
5. Send test email
6. Send to all subscribers (batch sending, 100 per batch)

**Database Schema:**
```sql
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  normalized_email TEXT NOT NULL,
  source TEXT DEFAULT 'contest_vote', -- Acquisition channel
  metro VARCHAR(100), -- Derived from ZIP
  zip_code VARCHAR(10),

  -- Status
  subscribed BOOLEAN DEFAULT TRUE,
  confirmed BOOLEAN DEFAULT FALSE,

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,

  -- Timestamps
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_newsletter_normalized ON newsletter_subscribers(normalized_email);
CREATE INDEX idx_newsletter_subscribed ON newsletter_subscribers(subscribed) WHERE subscribed = TRUE;
CREATE INDEX idx_newsletter_metro ON newsletter_subscribers(metro);
```

**Unsubscribe:**
- Link in every email: `/newsletter/unsubscribe?token={normalizedEmail}`
- One-click unsubscribe (marks `subscribed = FALSE`)
- No re-subscription (prevents spam)

---

### 16.4 Social Media Strategy

**Purpose:** Drive traffic to contest, build brand awareness, create viral moments

#### Platform Priorities

**1. Reddit (Primary Traffic Driver)**

**Why Reddit:**
- Pet owners highly engaged
- Community-driven (natural fit for contests)
- Geo-targeting via city subreddits
- Free organic reach

**Target Subreddits (Tier 1 - Metro-Specific):**
- r/sanfrancisco (1M members)
- r/bayarea (500K members)
- r/oakland (100K members)
- r/Seattle (500K members)
- r/LosAngeles (800K members)
- r/sandiego (300K members)
- r/Denver (300K members)
- r/Austin (600K members)

**Target Subreddits (Tier 2 - Dog-Focused):**
- r/dogs (3.5M members)
- r/dogpictures (600K members)
- r/rarepuppers (2M members)
- r/aww (34M members)
- r/DogsBeingDerps (500K members)
- r/AnimalsBeingDerps (2M members)
- r/WhatWrongWithYourDog (500K members)

**Reddit Posting Strategy:**
- **Week 1:** Contest launch blitz
- **Week 2:** Featured entry showcase
- **Week 3:** Voting reminder
- **Week 4:** Winner announcement + next contest preview

**Reddit Best Practices:**
- ✅ Lead with entertainment value (funny photo), soft-sell contest
- ✅ Respond to ALL comments within first hour
- ✅ Post during peak times (Tue 9 AM, Wed 7 PM PST)
- ✅ Use multiple accounts to avoid spam flags
- ✅ Engage in subreddit for a week before promotional post
- ❌ Don't spam same content across subs at once
- ❌ Don't use obviously promotional language
- ❌ Don't ignore subreddit rules

**Optimal Posting Times (PST):**
- Monday: 9-11 AM
- Tuesday: 9 AM - 12 PM (highest engagement)
- Wednesday: 7-9 PM
- Thursday: 10 AM - 2 PM
- Friday: 8-10 AM
- Saturday: 8-10 AM
- Sunday: 6-9 PM

**2. Instagram (Visual Showcase)**

**Strategy:** Build engaged following through funny dog content

**Content Mix:**
- 50% Contest entries (funniest photos)
- 30% Featured daycares (with permission)
- 20% Dog tips, daycare selection advice

**Posting Schedule:**
- **Daily Stories:** Contest entries (tag owners)
- **Feed Posts:** 3-4x per week
  - Monday: Contest entry showcase
  - Wednesday: Featured daycare
  - Friday: Winner update / voting reminder
  - Sunday: Contest results / new contest launch

**Hashtag Strategy:**
```
Primary (high engagement):
#DogsOfInstagram #FunnyDogs #DogPhotography #ContestAlert
#DogsDoingRidiculousThings #DogContest

Location-based:
#SanFranciscoDogs #BayAreaDogs #CADogs #[City]Dogs

Size-appropriate:
50K-500K: #DogLoversOfInstagram #DogLife
5K-50K: #ContestTime #WinCash
500-5K: #DogsBeingDerps #DerpyDogs
```

**Instagram Features:**
- **Reels:** 30-sec funny dog compilations (highest reach)
- **Stories:** Daily contest updates, polls
- **Highlights:** "Contest Winners", "Featured Daycares", "How to Enter"
- **Bio Link:** Link to contest page

**Growth Tactics:**
- Partner with local dog influencers
- Run "tag a friend" contests
- Cross-promote with featured daycares
- Instagram Ads ($50/week for contest posts)

**3. Facebook (Community Building)**

**Content Types:**
- Photos: Contest entries (3-4x/week)
- Live Videos: Winner announcements (monthly)
- Events: Contest end dates
- Polls: "Which dog is funniest?"

**Facebook Groups to Target:**
- "[City] Dog Owners"
- "[City] Pet Parents"
- "Dog Daycare Reviews"
- Post WITH permission (ask admins)

**Facebook Ads:**
- Audience: Pet owners, 25-55, within 25 miles of target cities
- Budget: $100/month per metro
- Objective: Traffic to contest page
- Creative: Funniest contest photo + "$500 Prize"

**4. Twitter/X (Real-Time Engagement)**

**Posting Frequency:** 2-3x daily
- Morning (9 AM): Contest entry showcase
- Afternoon (2 PM): Funny dog tweet (no promo)
- Evening (7 PM): Voting reminder or daycare feature

**Hashtags:**
```
Contest posts: #DogContest #FunnyDogs #Win #ContestAlert #DogsOfTwitter
Trending: #NationalDogDay #DogMonday #TongueOutTuesday #WednesdayWoof
```

**5. TikTok (Viral Potential)**

**Content Ideas:**
- "Top 5 funniest contest entries this week"
- "Dogs doing ridiculous things compilation"
- "Behind the scenes: How we pick winners"
- "Daycare owner reacts to funny dog photo"

**TikTok Best Practices:**
- Post 1-2x daily
- Hook viewers in first 3 seconds
- Use trending audio
- Add text overlay with CTA
- End with "Link in bio to enter"

**Hashtags:**
```
#FunnyDogs #DogsOfTikTok #DogContest #Win #DogFail
#[City]Dogs #PetsOfTikTok
```

#### Social Media Weekly Calendar

**Monday:**
- Reddit: Contest launch/voting reminder
- Instagram: Contest entry showcase
- Twitter: "Monday motivation from [dog]"
- Facebook: Weekly poll

**Tuesday:**
- Reddit: Featured entry in r/aww
- Instagram Story: Contest updates
- Twitter: Funny tweet

**Wednesday:**
- Instagram: Featured daycare
- Twitter: Mid-week voting reminder
- TikTok: Funny compilation

**Thursday:**
- Reddit: Engagement in target subs
- Instagram Story: "Which is funnier?" poll
- Twitter: Engagement with dog tweets

**Friday:**
- Instagram: "Vote this weekend!" reminder
- Twitter: Weekend voting push
- Facebook: "Last chance to enter!"

**Saturday:**
- Instagram Stories: Contest highlights
- Twitter: Casual dog content

**Sunday:**
- End of week voting push
- End of month: Winner announcement EVERYWHERE

#### Paid Advertising Budget

**Monthly Budget: $500**

**Allocation:**
- Facebook Ads: $200 (contest promotion)
- Instagram Ads: $200 (visual ads)
- Reddit Ads: $100 (promoted posts)

**ROI Targets:**
- Cost per contest entry: <$5
- Cost per newsletter signup: <$2
- Cost per daycare page view: <$0.50

---

### 16.5 Content Creation & Moderation

**Admin Dashboard:** `/admin/social`

**Features:**
- Schedule social media posts
- Export contest entries for posting
- Generate social media graphics
- Track post performance
- Moderate contest submissions

**Content Moderation:**
- Review all contest submissions before approval
- Remove inappropriate content
- Ensure photos are dog-related
- Verify no copyright violations
- Check for spam/duplicate accounts

**Social Media Templates:**

**Reddit Contest Invite:**
```
[Funny description of dog's ridiculous behavior]

[Dog's name] is competing in our Dogs Doing Ridiculous Things Contest!

Categories: 🤪 Goofiest Face | 🥴 Biggest Derp | ✂️ Worst Haircut | 😂 Epic Fail

Prizes: 🥇 $500 | 🥈 $250 | 🥉 $100

100% free to enter. No purchase necessary.

Vote: woofspots.com/contest
```

**Instagram Story:**
```
[Funny dog photo]
"Vote for [Name]!" (text overlay)
Poll: "Is this hilarious?" (Yes/Absolutely)
Swipe up: woofspots.com/contest
```

**Twitter Thread:**
```
1/ 🐕 Meet [Name], currently WINNING with [X] votes! [Photo]

2/ "[Owner quote about funny moment]" - [Name] is competing for $500 💰

3/ Categories: 🤪 Goofiest Face | 🥴 Biggest Derp | ✂️ Worst Haircut | 😂 Epic Fail

4/ Enter FREE at woofspots.com/contest #DogContest #FunnyDogs
```

---

### 16.6 Growth Milestones

**Month 1 (Launch):**
- 50 contest entries
- 500 newsletter subscribers
- 5,000 site visits
- 1 viral Reddit post (>1K upvotes)

**Month 3:**
- 200 contest entries
- 2,000 newsletter subscribers
- 20,000 site visits
- Instagram: 1,000 followers
- Facebook: 500 page likes

**Month 6:**
- 500 contest entries
- 10,000 newsletter subscribers
- 100,000 site visits
- Instagram: 5,000 followers
- 5 premium daycare subscribers (contest-driven)

**Month 12:**
- 2,000 contest entries
- 50,000 newsletter subscribers
- 500,000 site visits
- Instagram: 20,000 followers
- 50 premium daycare subscribers

---

### 16.7 Metrics & Analytics

**Contest Metrics:**
- Entries per month (by category)
- Votes per entry (distribution)
- Entry approval rate
- Voter email conversion to newsletter
- Submitter email conversion to newsletter

**Newsletter Metrics:**
- Subscriber growth rate
- Open rate (target: 25-35%)
- Click-through rate (target: 5-10%)
- Unsubscribe rate (target: <2%)
- Acquisition source breakdown (contest vs. other)
- Metro segmentation effectiveness

**Social Media Metrics:**
- Post reach (organic + paid)
- Engagement rate (likes, comments, shares)
- Click-through rate to contest
- Follower growth rate
- Top performing posts (by platform)
- Cost per acquisition (paid ads)

**Conversion Funnel:**
```
1. Social Media Post → 10,000 views
2. Contest Page Visit → 1,000 clicks (10% CTR)
3. Vote or Submit → 200 actions (20% conversion)
4. Newsletter Signup → 200 subscribers (100% auto-opt-in)
5. Directory Browse → 100 users (50%)
6. Daycare Page View → 50 users (50%)
7. Claimed Listing → 5 business owners (10%)
8. Top Dog Subscription → 1 subscriber (20%)
```

---

## 17. Success Metrics

### 17.1 User Engagement KPIs

**Traffic Metrics:**
- Monthly Unique Visitors
  - Current: TBD
  - Target (Q2 2026): 10,000
  - Target (Q4 2026): 50,000

- Pages per Session
  - Target: 3.5+ (homepage → search → listing)

- Average Session Duration
  - Target: 2+ minutes

- Bounce Rate
  - Target: <40% (engaged visitors)

**Conversion Metrics:**
- Click-through Rate to Business Websites
  - Target: 15-25% of listing page visitors

- Click-through Rate to Phone Numbers
  - Target: 5-10% of listing page visitors

- Directions Clicks
  - Target: 5-10% of listing page visitors

### 17.2 Business KPIs

**Listing Coverage:**
- Total Listings
  - Current: 6,837
  - Target (Q2 2026): 8,000 (add LA, SD)
  - Target (Q4 2026): 15,000 (add Seattle, Portland, Denver)

- Claimed Listings
  - Current: 0
  - Target (Q1 2026): 100
  - Target (Q2 2026): 500

- Top Dog Subscribers
  - Current: 0
  - Target (Q1 2026): 10
  - Target (Q2 2026): 50
  - Target (Q4 2026): 200

**Data Quality:**
- % Listings with Complete Data
  - Current: ~75% (missing hours, amenities)
  - Target: 90%+ (improve scraper)

- Average Data Freshness
  - Current: Manual scrape (weeks old)
  - Target: <7 days (automated weekly refresh)

### 17.3 Revenue KPIs

**Monthly Recurring Revenue (MRR):**
- Q1 2026: $990 (10 subscribers @ $99/mo)
- Q2 2026: $4,950 (50 subscribers)
- Q4 2026: $19,800 (200 subscribers)

**Annual Recurring Revenue (ARR):**
- Q1 2026: $11,880
- Q2 2026: $59,400
- Q4 2026: $237,600

**Conversion Rate (Claimed → Top Dog):**
- Target: 10-20% (industry benchmark for freemium SaaS)

**Churn Rate:**
- Target: <5% monthly
- Strategy: High engagement, clear ROI, strong customer support

**Customer Lifetime Value (CLV):**
- Average subscription duration: 18 months
- CLV (Monthly): $99 × 18 = $1,782
- CLV (Annual): $990 × 1.5 = $1,485 (lower churn)

**Customer Acquisition Cost (CAC):**
- Target: $50-150 per Top Dog subscriber
- Channels:
  - Direct email outreach: $20-50
  - Paid ads: $100-200
  - Organic (SEO): $10-30

**LTV/CAC Ratio:**
- Target: 10-20x (healthy SaaS metrics)
- Current (projected): $1,782 / $100 = 17.8x

### 17.4 Analytics Implementation (Future)

**Tool:** Google Analytics 4 or Plausible (privacy-focused)

**Events to Track:**
```javascript
// Pet owner events
trackEvent('page_view', { page: '/listing/123' });
trackEvent('website_click', { daycareId: 123, tier: 'top_dog' });
trackEvent('phone_click', { daycareId: 123 });
trackEvent('directions_click', { daycareId: 123 });

// Business owner events
trackEvent('signup', { email: 'owner@business.com' });
trackEvent('claim_listing', { daycareId: 123 });
trackEvent('upgrade_to_top_dog', { daycareId: 123, plan: 'annual' });
trackEvent('subscription_canceled', { daycareId: 123 });
```

**Dashboard Reporting:**
- Real-time: Current active users
- Daily: Page views, conversions
- Weekly: Traffic sources, top listings
- Monthly: Revenue, churn, growth

---

## 18. Technical Roadmap

### 18.1 Q4 2025 (MVP Complete) ✅

**Completed:**
- ✅ Enhanced Google Maps scraper with 25+ data fields
- ✅ Database migration for tier system
- ✅ Three-tier listing system (unclaimed, claimed, top_dog)
- ✅ User authentication (registration, login, JWT)
- ✅ Stripe integration (checkout, webhooks, subscriptions)
- ✅ Pricing page with monthly/annual plans
- ✅ Business dashboard (basic version)
- ✅ Navigation flow optimization (card → listing → website)
- ✅ Google Maps attribution
- ✅ Database functions (claim_listing, upgrade_to_top_dog, downgrade_from_top_dog)
- ✅ 6,837 listings across Bay Area

### 18.2 Q1 2026 (Growth & Optimization)

**Objectives:** Acquire first 100 claimed listings, 10 Top Dog subscribers

**Features:**
- 🔄 SEO optimization (meta tags, structured data, sitemap)
- 🔄 City landing pages (90+ pages)
- 🔄 Email verification for claims
- 🔄 Analytics dashboard for business owners
- 🔄 Photo upload functionality (S3 or Cloudinary)
- 🔄 Business hours editor
- 🔄 Custom description editor (500 words)
- 🔄 Social sharing (Open Graph tags)
- 🔄 Performance monitoring (Vercel Analytics)

**Technical Debt:**
- Refactor auth to use refresh tokens
- Add error tracking (Sentry)
- Implement rate limiting
- Add API documentation (Swagger)

**Marketing:**
- Launch direct email campaign to 500 businesses
- Set up Google Ads campaigns
- Create Instagram/Facebook accounts
- Write 5 SEO blog posts

**Metrics Targets:**
- 100 claimed listings
- 10 Top Dog subscribers
- 5,000 monthly visitors
- $990 MRR

### 18.3 Q2 2026 (Feature Expansion & Geographic Growth)

**Objectives:** Expand to LA/SD, add premium features

**Features:**
- Special offers/promotions system
- Contact form integration
- Enhanced analytics (charts, graphs, exports)
- Review system (separate from Google)
- Email notifications (new reviews, weekly digest)
- Stripe Customer Portal integration
- Mobile app (React Native) - MVP

**Geographic Expansion:**
- Los Angeles Metro (100+ cities)
- San Diego Metro (50+ cities)
- Expected: +2,000 listings

**Technical Infrastructure:**
- Automated scraping (Vercel Cron)
- Database optimization (query performance)
- CDN for images (Cloudinary)
- Email service (SendGrid or Resend)

**Metrics Targets:**
- 500 claimed listings
- 50 Top Dog subscribers
- 20,000 monthly visitors
- $4,950 MRR

### 18.4 Q3-Q4 2026 (Scale & Advanced Features)

**Objectives:** National expansion, advanced features

**Features:**
- Advanced search (map view, distance radius)
- Multi-photo upload (drag & drop)
- Video uploads (facility tours)
- User reviews with moderation
- Referral program (refer a business, get $)
- Affiliate program (bloggers, influencers)
- API for partners (Rover, Wag integration)
- White-label solution (sell to other directories)

**Geographic Expansion:**
- Seattle Metro
- Portland Metro
- Denver Metro
- Austin Metro
- Expected: +5,000 listings

**Mobile App:**
- iOS app (React Native)
- Android app (React Native)
- Push notifications
- Offline mode

**Metrics Targets:**
- 1,000 claimed listings
- 200 Top Dog subscribers
- 100,000 monthly visitors
- $19,800 MRR

---

## 19. Risks & Mitigation

### 19.1 Technical Risks

**Risk: Google Maps Blocking/Rate Limiting**
- Likelihood: Medium
- Impact: High (data collection stops)
- Mitigation:
  - Respectful scraping (2-5 second delays)
  - Rotating user agents
  - Distributed scraping (multiple IP addresses)
  - Caching strategy (weekly refresh, not daily)
  - Fallback to manual data entry for critical listings
  - Explore Google Places API (paid alternative)

**Risk: Data Accuracy Degradation**
- Likelihood: Medium
- Impact: Medium (user trust erosion)
- Mitigation:
  - Automated weekly refresh jobs
  - Business owner reporting tools ("Report incorrect info")
  - Manual verification for premium listings
  - Community moderation (future)

**Risk: Database Performance Issues**
- Likelihood: Low
- Impact: Medium (slow page loads)
- Mitigation:
  - Proper indexing (already implemented)
  - Query optimization (EXPLAIN ANALYZE)
  - Connection pooling (@vercel/postgres)
  - Neon auto-scaling
  - Read replicas (future, if needed)

**Risk: Stripe Integration Failures**
- Likelihood: Low
- Impact: High (lost revenue)
- Mitigation:
  - Webhook signature verification (prevents spoofing)
  - Idempotency keys (prevent duplicate charges)
  - Error logging and alerts
  - Manual reconciliation (daily Stripe dashboard check)
  - Test mode validation before production

### 19.2 Business Risks

**Risk: Low Premium Conversion Rate**
- Likelihood: Medium
- Impact: High (revenue targets missed)
- Mitigation:
  - Free trial period (14-30 days)
  - Tiered pricing ($49/99/149 - future)
  - Clear ROI demonstration (show traffic numbers)
  - Testimonials from early adopters
  - Money-back guarantee (30 days)

**Risk: High Churn Rate**
- Likelihood: Medium
- Impact: High (unsustainable growth)
- Mitigation:
  - Engagement emails (weekly analytics reports)
  - Customer success outreach (check-in calls)
  - Feature development based on feedback
  - Loyalty program (annual subscribers get bonus features)
  - Exit surveys to understand reasons

**Risk: Competitive Pressure**
- Likelihood: Medium
- Impact: Medium (market share loss)
- Mitigation:
  - First-mover advantage in Bay Area
  - Superior data quality (Google Maps sourced)
  - Premium feature differentiation
  - Strong SEO (domain authority)
  - Network effects (more listings = more traffic = more listings)

**Risk: Difficulty Acquiring Claimed Listings**
- Likelihood: Low
- Impact: Medium (slow growth)
- Mitigation:
  - Free claim (remove friction)
  - Direct email outreach (personalized)
  - Value proposition clarity (more visibility, website traffic)
  - Partner with industry associations
  - Incentives (free Top Dog trial for first 100 claims)

### 19.3 Legal Risks

**Risk: Google Terms of Service Violation**
- Likelihood: Low
- Impact: High (cease & desist)
- Mitigation:
  - Public data aggregation defense (legal precedent)
  - Proper attribution (clear sourcing)
  - No photo scraping (use only metadata)
  - Legal review before scaling
  - Willingness to switch to Google Places API (paid)

**Risk: False Business Claims**
- Likelihood: Medium
- Impact: Medium (user trust, legal disputes)
- Mitigation:
  - Email verification required
  - Domain verification (future: require business email)
  - DMCA takedown policy
  - Manual review for disputes
  - Evidence requirement (business documents)
  - Insurance (E&O insurance)

**Risk: User Data Breach**
- Likelihood: Low
- Impact: Very High (reputation damage, legal liability)
- Mitigation:
  - Password hashing (bcrypt, salt rounds: 10)
  - httpOnly cookies (prevent XSS)
  - HTTPS only (secure flag)
  - No storage of payment info (Stripe handles)
  - Regular security audits
  - Bug bounty program (future)

**Risk: GDPR/CCPA Non-Compliance**
- Likelihood: Low
- Impact: High (fines, legal issues)
- Mitigation:
  - Privacy policy (legal review)
  - Cookie consent banner
  - Data deletion API (user requests)
  - Data export functionality
  - Legal consultation (annual review)

---

## 20. Open Questions & Future Considerations

### 20.1 Pricing Strategy

**Questions:**
1. **Optimal Price Point:** Is $99/mo too high? Too low?
   - Consider: $49/mo (starter), $99/mo (pro), $149/mo (enterprise)
   - Test: Offer $49/mo for first 50 subscribers, gauge demand

2. **Annual Discount:** Is 17% enough to drive conversions?
   - Industry standard: 15-20%
   - Test: 20% off ($950/yr) vs. 17% off ($990/yr)

3. **Lifetime Deals:** Offer one-time payment ($2,500 lifetime)?
   - Pros: Immediate cash flow, strong commitment
   - Cons: Lost long-term revenue, hard to sustain

### 20.2 Feature Prioritization

**Questions:**
1. **Photo Uploads:** Build in-house or use third-party (Cloudinary)?
   - In-house: More control, lower long-term cost
   - Third-party: Faster implementation, better optimization

2. **Review System:** Build proprietary reviews or rely on Google?
   - Proprietary: More engagement, unique data, SEO content
   - Google-only: Less development, trusted source

3. **Mobile App:** Is it necessary or nice-to-have?
   - Pros: Better UX, push notifications, app store visibility
   - Cons: Development cost, maintenance burden

### 20.3 Business Model Alternatives

**Questions:**
1. **Lead Generation:** Charge per contact form submission ($5-10 per lead)?
   - Pros: Performance-based pricing, aligns incentives
   - Cons: Harder to predict revenue, spam concerns

2. **Featured Placements:** Sell homepage/city page placements ($200/mo)?
   - Pros: Additional revenue stream
   - Cons: User experience concerns (ads vs. organic)

3. **Affiliate Revenue:** Earn commission on bookings (10-15%)?
   - Pros: Passive revenue, aligns with user intent
   - Cons: Requires booking integration (complex)

4. **White Label:** Sell software to other pet directories ($5,000 setup + $500/mo)?
   - Pros: High-margin, scalable
   - Cons: Support burden, feature requests

### 20.4 Long-Term Vision

**Questions:**
1. **Vertical Expansion:** Add other pet services (groomers, vets, trainers)?
   - Pros: Larger addressable market, cross-selling
   - Cons: Diluted focus, competitive intensity

2. **Horizontal Expansion:** International markets (Canada, UK, Australia)?
   - Pros: Massive TAM, less competition
   - Cons: Localization, legal complexity

3. **Exit Strategy:** Build to sell or build for cash flow?
   - Sell: Target acquirer (Rover, Wag, Yelp) - valuation $5-10M
   - Cash flow: Bootstrap to $500k-1M ARR, lifestyle business

---

## 21. Appendix

### 21.1 Current System Status (October 24, 2025)

**Database:**
- ✅ 6,837 dog daycare listings
- ✅ Tier system deployed (unclaimed, claimed, top_dog)
- ✅ Database functions created (claim, upgrade, downgrade)
- ✅ Indexes optimized for performance

**Authentication:**
- ✅ User registration/login
- ✅ JWT tokens with httpOnly cookies
- ✅ Password hashing (bcrypt)

**Stripe Integration:**
- ✅ Products created (Monthly $99, Annual $990)
- ✅ Checkout flow implemented
- ✅ Webhooks configured (upgrade/downgrade automation)
- ✅ Metadata tracking (daycareId, plan)

**Pages:**
- ✅ Homepage
- ✅ Search/Directory
- ✅ Listing pages
- ✅ Pricing page
- ✅ Login/Register
- ✅ Dashboard (basic)

**Remaining MVP Tasks:**
- 🔄 Email verification
- 🔄 Claim listing flow (UI)
- 🔄 Photo upload (S3/Cloudinary)
- 🔄 SEO optimization (meta tags, structured data)
- 🔄 Analytics dashboard

### 21.2 Technology Dependencies

**Production:**
- Vercel (hosting, edge network, deployments)
- Neon (serverless Postgres database)
- Stripe (payment processing, subscriptions)
- Next.js 15 (framework)

**Development:**
- Playwright (scraping)
- Turborepo (monorepo)
- TypeScript (type safety)
- Tailwind CSS (styling)

**Future:**
- Cloudinary or S3 (image hosting)
- SendGrid or Resend (transactional emails)
- Sentry (error tracking)
- Plausible or GA4 (analytics)

### 21.3 Key Files Reference

**Configuration:**
- `package.json` - Dependencies, scripts
- `turbo.json` - Monorepo build config
- `.env.local` - Environment variables (local)
- `vercel.json` - Deployment config (future)

**Database:**
- `migrations/add-tier-system.sql` - Tier columns, indexes
- `migrations/add-tier-functions.sql` - PL/pgSQL functions
- `scripts/run-tier-migration.js` - Migration runner

**Authentication:**
- `apps/web/lib/auth.ts` - JWT utilities
- `apps/web/lib/auth-context.tsx` - React context
- `apps/web/middleware.ts` - Route protection

**Payments:**
- `apps/web/lib/stripe.ts` - Stripe config, plans
- `apps/web/app/api/subscriptions/create-checkout/route.ts` - Checkout
- `apps/web/app/api/subscriptions/webhook/route.ts` - Webhook handler

**Documentation:**
- `PRD.md` - This document (Product Requirements)
- `PRICING_TIERS.md` - Tier system specification
- `STRIPE_PRODUCT_DESCRIPTIONS.md` - Product copy
- `MIGRATION_INSTRUCTIONS.md` - Database migration guide

### 21.4 Contact & Support

**Product Owner:** [Your Name]
**Email:** [Your Email]
**Repository:** [GitHub URL]
**Production URL:** https://woofspots.com (future)
**Staging URL:** [Vercel preview URL]

---

**Document Version:** 2.0
**Last Updated:** October 24, 2025
**Next Review:** November 15, 2025
**Status:** Complete - Ready for Production Launch

---

*End of Product Requirements Document*
