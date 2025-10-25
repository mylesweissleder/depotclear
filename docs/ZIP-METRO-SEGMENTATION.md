# ZIP Code → Metro Area Segmentation System

## Overview
The Woof Spots newsletter system collects ZIP codes from contest voters and automatically maps them to metro areas for localized weekly newsletters. Users outside our 50 service metros receive a generic nationwide newsletter.

## How It Works

### 1. ZIP Code Collection
**File:** `/Users/myles/depotclear/apps/web/app/contest/page.tsx`

When users vote in the contest, they're required to provide:
- Email address
- ZIP code (5 digits, validated)

The voting modal UI explains:
> "📍 Get localized dog care recommendations in your area!"
> "🔒 By voting, you'll receive **weekly** newsletters featuring contest entries, winners, and dog care recommendations in your metro area."

### 2. Automatic Metro Mapping
**File:** `/Users/myles/depotclear/apps/web/lib/zip-to-metro.ts`

ZIP codes are automatically mapped to metro areas using ZIP prefix lookup:

```typescript
zipToMetro("94102") → { metro: "san-francisco", region: "bay-area" }
zipToMetro("10001") → { metro: "new-york", region: "northeast" }
zipToMetro("99999") → null // Outside service areas
```

**Coverage:** 50 metro areas across 8 regions:
- **Bay Area:** San Francisco, Oakland, San Jose, Walnut Creek, San Rafael, Pleasanton
- **SoCal:** Los Angeles, Santa Monica, Long Beach, Irvine, San Diego
- **California:** Sacramento, Santa Cruz, San Luis Obispo
- **Pacific Northwest:** Seattle, Tacoma, Portland
- **Northeast:** New York, Boston, Washington DC, Philadelphia, Baltimore
- **Midwest:** Chicago, Minneapolis, Madison, Ann Arbor
- **Mountain:** Denver, Boulder, Salt Lake City
- **Southwest:** Austin, Dallas, Houston, San Antonio, Phoenix, Las Vegas, Albuquerque
- **Southeast:** Miami, Atlanta, Nashville, Charlotte, Raleigh, Tampa, Orlando

### 3. Database Storage
**Tables:**
- `pup_votes` - Records each vote with `voter_zip` for analysis
- `newsletter_subscribers` - Stores email with `zip_code` and derived `metro` field

**Schema:**
```sql
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  normalized_email TEXT NOT NULL,
  zip_code VARCHAR(5),          -- Raw ZIP code
  metro VARCHAR(100),            -- Derived: 'san-francisco', 'new-york', or NULL
  source TEXT DEFAULT 'contest_vote',
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletter_metro ON newsletter_subscribers(metro);
```

### 4. Metro Assignment Logic
**File:** `/Users/myles/depotclear/apps/web/app/api/contest/vote/route.ts`

```typescript
// Map ZIP → metro
const metroData = zipToMetro(voterZip);
const metro = metroData?.metro || null; // null = generic newsletter

// Store in database
INSERT INTO newsletter_subscribers
  (email, zip_code, metro, ...)
VALUES
  ($1, $2, $3, ...)
```

**Result:**
- ZIP `94102` → `metro = "san-francisco"` → Gets SF Bay Area newsletter
- ZIP `99999` → `metro = NULL` → Gets generic nationwide newsletter

## Newsletter Segmentation Queries

### Get all subscribers in a specific metro:
```sql
SELECT email, zip_code
FROM newsletter_subscribers
WHERE metro = 'san-francisco'
  AND subscribed = TRUE;
```

### Get all subscribers for generic newsletter (outside service areas):
```sql
SELECT email, zip_code
FROM newsletter_subscribers
WHERE metro IS NULL
  AND subscribed = TRUE;
```

### Count subscribers by metro:
```sql
SELECT
  COALESCE(metro, 'generic') as metro_area,
  COUNT(*) as subscribers
FROM newsletter_subscribers
WHERE subscribed = TRUE
GROUP BY metro
ORDER BY subscribers DESC;
```

## Usage Examples

### Example 1: San Francisco Voter
- User enters ZIP: `94102`
- System maps to: `metro = "san-francisco"`, `region = "bay-area"`
- Receives: Weekly SF Bay Area newsletter with:
  - Contest entries from Bay Area
  - Dog daycares in SF/Oakland/San Jose
  - Local fun facts: "Tech workers in SF prefer French Bulldogs"

### Example 2: Rural Montana Voter
- User enters ZIP: `59001`
- System maps to: `metro = NULL` (not in service areas)
- Receives: Generic nationwide newsletter with:
  - Top contest entries from all metros
  - Popular daycares nationwide
  - General dog care tips

### Example 3: New York Voter
- User enters ZIP: `10001`
- System maps to: `metro = "new-york"`, `region = "northeast"`
- Receives: Weekly NYC newsletter with:
  - Contest entries from NYC metro
  - Dog daycares in Manhattan/Brooklyn/Queens
  - Local fun facts: "NYC apartment dwellers love small breeds"

## Metro Display Names

Human-readable names for UI:
```typescript
getMetroDisplayName("san-francisco") → "San Francisco Bay Area"
getMetroDisplayName("new-york") → "New York City"
getMetroDisplayName(null) → "Nationwide"
```

## Files Modified/Created

### Created:
- ✅ `/Users/myles/depotclear/apps/web/lib/zip-to-metro.ts` - ZIP → metro mapping utility
- ✅ `/Users/myles/depotclear/packages/scraper/migrations/add-zip-codes.sql` - Database schema
- ✅ `/Users/myles/depotclear/packages/scraper/src/migrate-zip-codes.js` - Migration runner

### Modified:
- ✅ `/Users/myles/depotclear/apps/web/app/contest/page.tsx:918-933` - Added ZIP field to voting modal
- ✅ `/Users/myles/depotclear/apps/web/app/api/contest/vote/route.ts` - ZIP validation & metro mapping
- ✅ `/Users/myles/depotclear/packages/scraper/migrations/create-newsletter-table.sql` - Updated with ZIP/metro fields

## Next Steps: Building the Newsletter System

1. **Create newsletter sending API** (`/api/newsletter/send`)
   - Query subscribers by metro
   - Generate localized content per metro
   - Send via Resend with tracking

2. **Build newsletter template** (based on `/Users/myles/Desktop/sfnt/sfnt-site/emails/WeeklyNewsletter.tsx`)
   - React Email components
   - Metro-specific sections
   - Contest winner showcases
   - Local daycare highlights

3. **Prepopulate 52 weekly newsletters**
   - Content calendar
   - Metro-specific "fun facts"
   - Scheduled sends

4. **Analytics & tracking**
   - Open rates by metro
   - Click-through rates
   - Unsubscribe tracking
