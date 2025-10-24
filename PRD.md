# Product Requirements Document: Bay Area Dog Daycare Directory

**Version:** 1.0
**Last Updated:** October 24, 2025
**Status:** MVP in Development

---

## 1. Executive Summary

### 1.1 Product Vision
A comprehensive, accurate directory of dog daycare facilities across the San Francisco Bay Area that connects pet owners with verified, high-quality care options while providing business owners with premium marketing and management tools.

### 1.2 Product Mission
To be the most trusted and comprehensive resource for dog daycare discovery in the Bay Area by:
- Providing 100% accurate, Google Maps-sourced business information
- Driving direct traffic to business websites (not just aggregating reviews)
- Offering premium tools for business owners to manage and promote their listings
- Expanding to other major metropolitan areas

### 1.3 Target Users

**Primary Users:**
- Dog owners seeking daycare services in the SF Bay Area
- Demographics: 25-55, urban/suburban residents, median income $75k+

**Secondary Users:**
- Dog daycare business owners/operators
- New Bay Area residents researching pet services
- Out-of-town visitors needing temporary pet care

---

## 2. Market Opportunity

### 2.1 Market Size
- **Geographic Coverage (Current):** 90+ cities across 7 Bay Area counties
  - San Francisco County
  - Marin County
  - Sonoma County
  - Napa County
  - Contra Costa County
  - Alameda County
  - Santa Clara County
  - San Mateo County

- **Expansion Markets (Planned):**
  - Seattle Metro
  - Los Angeles Metro
  - San Diego Metro

### 2.2 Competitive Advantage
1. **Data Accuracy:** 100% Google Maps sourced - no fake ratings or placeholder data
2. **Business Value:** Direct traffic to business websites vs. just Google Maps links
3. **Proper Attribution:** Legally compliant data usage with clear sourcing
4. **Comprehensive Coverage:** 90+ cities vs. competitors focusing on major metros only

---

## 3. Product Architecture

### 3.1 Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Lucide React (icons)

**Backend:**
- Next.js API Routes
- Vercel Postgres (serverless PostgreSQL)
- Edge Runtime compatibility

**Data Collection:**
- Playwright (browser automation)
- Google Maps scraping
- Anti-detection measures

**Infrastructure:**
- Vercel (hosting & deployment)
- Neon/Vercel Postgres (database)
- Turbo (monorepo management)

### 3.2 Project Structure
```
depotclear/
├── apps/
│   └── web/               # Next.js application
│       ├── app/
│       │   ├── page.tsx           # Homepage
│       │   ├── search/page.tsx    # Search/directory
│       │   ├── listing/[id]/      # Individual listing
│       │   └── api/daycares/      # API endpoint
├── packages/
│   └── scraper/           # Data collection tools
│       ├── src/
│       │   └── enhanced-scraper.js
│       └── migrations/
└── package.json
```

---

## 4. Core Features

### 4.1 MVP Features (Current Implementation)

#### 4.1.1 Directory/Search Page
**Location:** `/search`

**Features:**
- **Search & Filters:**
  - Text search (name, address, city)
  - City filter (90+ Bay Area cities)
  - Business type filter (daycare, boarding, grooming, etc.)
  - Minimum rating slider
  - Sort options (rating, reviews, name)

- **Results Display:**
  - Card-based grid layout
  - Star rating visualization (5-star display)
  - Review count
  - Phone & website links
  - City/address information
  - Google Maps attribution

- **Pagination:**
  - Load 50 results initially
  - "Load More" button
  - Total results counter

#### 4.1.2 Individual Listing Pages
**Location:** `/listing/[id]`

**Features:**
- Full business details
- Contact information (phone, website)
- Ratings and reviews (from Google Maps)
- Primary CTA: Business website (if available)
- Secondary CTA: Google Maps (for reviews/directions)
- Proper Google Maps attribution

#### 4.1.3 Navigation Flow
- **Card Click → Listing Page:** Users land on internal listing page (better SEO)
- **Listing Page → Business Website:** Primary action sends traffic to business
- **Listing Page → Google Maps:** Secondary action for reviews/directions

---

## 5. Data Model

### 5.1 Database Schema

**Table:** `dog_daycares`

**Core Fields:**
```sql
id                   SERIAL PRIMARY KEY
name                 VARCHAR(255) NOT NULL
city                 VARCHAR(100) NOT NULL
region               VARCHAR(100) DEFAULT 'bay-area'
address              TEXT
phone                VARCHAR(50)
website              TEXT
google_maps_url      TEXT
created_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at           TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Rating/Review Fields:**
```sql
rating               DECIMAL(2,1)  -- e.g., 4.7
review_count         INTEGER       -- actual count from Google
price_level          INTEGER       -- 1-4 ($-$$$$)
```

**Enhanced Google Maps Data:**
```sql
business_hours       JSONB         -- {monday: "9 AM-6 PM", ...}
business_status      VARCHAR(50)   -- 'open', 'temporarily_closed'
google_categories    JSONB         -- ["Dog day care center", ...]
latitude             DECIMAL(10,8)
longitude            DECIMAL(11,8)
place_id             VARCHAR(255) UNIQUE  -- Google's unique ID
service_options      JSONB         -- {online_appointments: true, ...}
wheelchair_accessible BOOLEAN
amenities            JSONB         -- {outdoor_play: true, grooming: true, ...}
photos               JSONB         -- Array of image URLs
years_in_business    INTEGER
scraped_at           TIMESTAMP
```

**Indexes:**
```sql
CREATE INDEX idx_dog_daycares_place_id ON dog_daycares(place_id);
CREATE INDEX idx_dog_daycares_coordinates ON dog_daycares(latitude, longitude);
CREATE INDEX idx_dog_daycares_status ON dog_daycares(business_status);
CREATE UNIQUE INDEX dog_daycares_name_city_key ON dog_daycares(name, city);
```

### 5.2 Data Collection Process

**Enhanced Scraper (`enhanced-scraper.js`):**
1. Iterates through 90+ Bay Area cities
2. For each city:
   - Searches Google Maps for "dog daycare in [city], CA"
   - Scrolls search results to load all businesses
   - Extracts all business links
3. For each business:
   - Visits individual detail page
   - Extracts comprehensive data (20+ fields)
   - Handles duplicate detection via place_id
   - Updates existing records with latest data
4. Rate limiting: 2-5 second delays between requests
5. Anti-detection: User-agent spoofing, webdriver hiding

**Data Quality Standards:**
- ✅ Only save ratings when review_count > 0
- ✅ No placeholder or fake data
- ✅ ON CONFLICT handling for duplicates
- ✅ Proper NULL handling for missing data

---

## 6. User Experience

### 6.1 User Flow: Find a Daycare

```
1. User lands on homepage
2. Clicks "Find Daycare" → /search
3. Applies filters (city, rating, etc.)
4. Browses results cards
5. Clicks card → /listing/[id]
6. Views full details
7. Clicks "Visit Official Website" → Business site
   OR
8. Clicks "View Reviews on Google Maps" → Google Maps
```

### 6.2 Design Principles

**Visual Design:**
- Bright, friendly color palette (orange, pink, yellow gradients)
- Large, bold typography
- High contrast for readability
- Card-based layouts with shadows
- Playful, pet-friendly aesthetic

**UX Principles:**
- Mobile-first responsive design
- Fast load times (serverless architecture)
- Clear CTAs
- Minimal friction to contact businesses
- Transparent data attribution

---

## 7. Monetization Strategy

### 7.1 Free Tier
**Target:** All dog daycare businesses

**Includes:**
- Basic listing with Google Maps data
- Business name, address, phone
- Website link
- Ratings & reviews (attributed to Google)
- City/region visibility
- Search & filter inclusion

### 7.2 Premium Tier (Planned)
**Target:** Business owners seeking enhanced visibility

**Pricing:** TBD (estimated $29-99/month)

**Features:**
- ✅ **Verified Badge:** "Claimed & Verified" indicator
- ✅ **Premium Photos:** Upload 10+ custom photos (vs. none for free)
- ✅ **Business Hours Editor:** Custom hours display
- ✅ **Special Offers:** Promotions, discounts, new customer deals
- ✅ **Priority Placement:** Boosted search ranking
- ✅ **Analytics Dashboard:**
  - Page views
  - Click-through rates
  - Website clicks
  - Phone clicks
- ✅ **Business Management:**
  - Update contact info
  - Add description
  - Manage amenities
- ✅ **Direct Lead Generation:** Contact form submissions

### 7.3 Revenue Projections
*To be determined based on market validation*

---

## 8. Premium Features Roadmap

### 8.1 Phase 1: Authentication & Claims (Q1 2026)
**Objective:** Enable business owners to claim listings

**Features:**
- Database schema for users & claims
- Email/password authentication
- Claim verification flow (email or phone verification)
- Basic business dashboard

**Technical Requirements:**
```sql
-- New tables
users (id, email, password_hash, created_at)
business_claims (id, user_id, daycare_id, status, verified_at)
subscriptions (id, user_id, plan, status, expires_at)
```

### 8.2 Phase 2: Premium Dashboard (Q1-Q2 2026)
**Objective:** Provide business management tools

**Features:**
- Photo upload (S3 or Cloudinary integration)
- Business hours editor
- Special offers management
- Listing preview
- Analytics widgets

**Tech Stack:**
- Next.js protected routes
- File upload with `next/image` optimization
- Stripe integration for payments

### 8.3 Phase 3: Analytics & Optimization (Q2 2026)
**Objective:** Provide value metrics to premium users

**Features:**
- Event tracking (views, clicks, conversions)
- Monthly performance reports
- Competitive insights
- Email notifications for new reviews

**Technical Requirements:**
- Analytics database tables
- Event capture middleware
- Dashboard visualizations (Chart.js or Recharts)

---

## 9. Legal & Compliance

### 9.1 Data Usage Policy

**Google Maps Data:**
- ✅ Public data aggregation
- ✅ Proper attribution on all pages: "Rating and business information from Google Maps"
- ✅ Links back to Google Maps for full details
- ❌ No scraping of user-uploaded photos (reserved for premium only)
- ✅ Regular data refreshes to maintain accuracy

**User Data:**
- Privacy policy (TBD)
- GDPR compliance for EU visitors
- CCPA compliance (California)
- Terms of service

### 9.2 Business Verification
- Email or phone verification required for premium claims
- Manual review process for disputes
- DMCA takedown policy for false claims

---

## 10. Growth Strategy

### 10.1 SEO Optimization (High Priority)

**On-Page SEO:**
- Meta titles: "[City] Dog Daycare | Best Dog Daycares in [City] 2025"
- Meta descriptions with local keywords
- Structured data (JSON-LD) for local businesses
- XML sitemap generation
- Open Graph tags for social sharing

**Technical SEO:**
- Fast page loads (Vercel Edge Network)
- Mobile-responsive
- Clean URL structure (`/listing/[id]`, `/search?city=oakland`)
- Internal linking structure

**Content Strategy:**
- City-specific landing pages
- Blog content (dog care tips, daycare selection guide)
- User-generated content (reviews, testimonials)

### 10.2 Geographic Expansion

**Phase 1: Bay Area (Current)**
- 90+ cities across 7 counties
- Estimated 1,000+ dog daycares

**Phase 2: California Expansion (Q2 2026)**
- Los Angeles Metro
- San Diego Metro
- Sacramento Metro

**Phase 3: National Expansion (Q3-Q4 2026)**
- Seattle Metro
- Portland Metro
- Denver Metro
- Austin Metro

**Scraper Architecture:**
- Modular city lists
- Regional configuration
- Automated scheduling (cron jobs for data refreshes)

### 10.3 Marketing Channels

**Organic:**
- SEO (primary driver)
- Social media (Instagram, Facebook local groups)
- Partnerships with pet supply stores
- Veterinarian referrals

**Paid:**
- Google Ads (high-intent keywords)
- Facebook/Instagram ads (geo-targeted)
- Sponsored content in pet blogs

**Direct Outreach:**
- Email campaigns to business owners
- Trade show presence (pet industry events)
- Press releases for new market launches

---

## 11. Success Metrics

### 11.1 User Engagement KPIs
- **Traffic:** Monthly unique visitors
- **Engagement:** Pages per session, avg. session duration
- **Conversions:**
  - Click-through rate to business websites
  - Click-through rate to Google Maps
  - Contact form submissions (premium feature)

### 11.2 Business KPIs
- **Coverage:** Number of listed businesses
- **Data Quality:** % of listings with complete data
- **Freshness:** Average age of scraped data

### 11.3 Revenue KPIs
- **Premium Subscribers:** Monthly recurring revenue (MRR)
- **Conversion Rate:** Free → Premium
- **Churn Rate:** Monthly premium cancellations
- **Customer Lifetime Value (CLV)**

---

## 12. Technical Roadmap

### 12.1 Q4 2025 (Current Sprint)
- ✅ Enhanced Google Maps scraper with comprehensive data
- ✅ Database migration for new fields
- ✅ Navigation flow optimization (card → listing → website)
- ✅ Google Maps attribution
- 🔄 **In Progress:** Full Bay Area scraping (90+ cities)

### 12.2 Q1 2026
- SEO optimization (meta tags, structured data, sitemap)
- Social sharing meta tags
- Performance monitoring (analytics integration)
- Database schema for premium features
- Business owner authentication system
- Listing claim flow

### 12.3 Q2 2026
- Premium photo uploads
- Business dashboard
- Payment integration (Stripe)
- Analytics dashboard for business owners
- Geographic expansion (LA, SD)

### 12.4 Q3-Q4 2026
- Advanced search (map view, distance radius)
- User reviews/ratings (separate from Google)
- Mobile app (React Native)
- API for partners

---

## 13. Risks & Mitigation

### 13.1 Technical Risks

**Risk:** Google Maps blocking/rate limiting
**Mitigation:**
- Respectful scraping (delays, user-agent rotation)
- Caching strategy to reduce scrape frequency
- Fallback to manual data entry for critical listings

**Risk:** Data accuracy degradation
**Mitigation:**
- Automated weekly refresh jobs
- Business owner reporting tools
- Manual verification for premium listings

### 13.2 Business Risks

**Risk:** Low premium conversion
**Mitigation:**
- Free trial period (30 days)
- Tiered pricing ($29/49/99)
- Clear ROI demonstration (analytics)

**Risk:** Competitive pressure
**Mitigation:**
- First-mover advantage in Bay Area
- Superior data quality
- Premium feature differentiation

### 13.3 Legal Risks

**Risk:** Google Terms of Service violation
**Mitigation:**
- Public data aggregation defense
- Proper attribution
- No photo scraping
- Legal review before scaling

---

## 14. Open Questions

1. **Pricing Strategy:** What price points maximize conversion while providing value?
2. **Verification Process:** How strict should business verification be?
3. **Photo Policy:** Allow user-uploaded photos on free tier with moderation?
4. **Review System:** Build proprietary review system or rely solely on Google?
5. **API Access:** Offer API for third-party integrations?
6. **White Label:** Sell technology to other pet service directories?

---

## 15. Appendix

### 15.1 Current Data Coverage
- **Cities Covered:** 90+ across Bay Area
- **Estimated Listings:** 1,000+
- **Data Points per Listing:** 25+
- **Update Frequency:** Weekly (automated)

### 15.2 Technology Dependencies
- Vercel (hosting, database)
- Playwright (browser automation)
- Next.js framework
- Stripe (payments, future)
- Cloudinary/S3 (image hosting, future)

### 15.3 Key Stakeholders
- **Product Owner:** [Your Name]
- **Development:** [Your Name / Team]
- **Marketing:** TBD
- **Legal:** TBD

---

**Document Control:**
- **Created:** October 24, 2025
- **Author:** Product Team
- **Next Review:** November 2025
- **Distribution:** Internal Team Only
