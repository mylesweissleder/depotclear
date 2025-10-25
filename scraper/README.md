# Woof Spots Google Maps Scraper

Automated scraper for collecting dog daycare data from Google Maps across 50+ major US metro areas.

## Features

- ✅ Multi-metro support (50+ cities across US)
- ✅ Comprehensive data extraction (20+ fields)
- ✅ Duplicate detection via `place_id`
- ✅ Automatic upserts (ON CONFLICT handling)
- ✅ Rate limiting (3-6 second delays between requests)
- ✅ Anti-detection measures (realistic user-agent, delays)
- ✅ Progress logging with statistics
- ✅ Error handling & retry logic

## Setup

1. **Install dependencies:**
   ```bash
   cd scraper
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install chromium
   ```

3. **Set environment variable:**
   ```bash
   export DATABASE_URL="your_postgres_connection_string"
   ```

## Usage

### Scrape Priority 1 Metros (Major Cities Only)
```bash
npm run scrape
```

Scrapes:
- San Francisco, Oakland, San Jose
- Los Angeles, San Diego
- Seattle, Portland
- Denver, Austin
- Chicago, New York, Boston

### Scrape ALL Metros (Including Secondary Cities)
```bash
npm run scrape:all
```

Scrapes all 20+ metros including:
- Berkeley, Palo Alto, Santa Monica, Pasadena
- Bellevue, Tacoma, Boulder, Cambridge, etc.

## Data Collected

For each daycare, the scraper collects:

| Field | Description |
|-------|-------------|
| `name` | Business name |
| `city` | City location |
| `state` | State (CA, WA, etc.) |
| `address` | Full street address |
| `phone` | Phone number |
| `website` | Official website URL |
| `rating` | Google Maps rating (1-5) |
| `review_count` | Number of reviews |
| `place_id` | Google Maps place ID (unique) |
| `google_maps_url` | Link to Google Maps listing |

## How It Works

1. **Search** - Searches Google Maps for "dog daycare in [City], [State]"
2. **Scroll** - Scrolls results to load all businesses (up to 50)
3. **Extract Links** - Collects links to individual business pages
4. **Scrape Details** - Visits each business page and extracts data
5. **Save** - Upserts to database (creates new or updates existing)
6. **Rate Limit** - Waits 3-6 seconds between requests

## Database Schema

Requires `dog_daycares` table with:

```sql
CREATE TABLE dog_daycares (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  address TEXT,
  phone TEXT,
  website TEXT,
  rating NUMERIC(2,1),
  review_count INTEGER,
  place_id TEXT UNIQUE,
  google_maps_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_place_id ON dog_daycares(place_id);
```

## Example Output

```
🚀 Starting scraper for 11 metros...

🔍 Scraping: San Francisco, CA
📍 Found 47 businesses in San Francisco
  [1/47] Scraping business...
    ✅ NEW: Pet Camp San Francisco
  [2/47] Scraping business...
    ♻️  UPDATED: Wag Hotels San Francisco
  [3/47] Scraping business...
    ✅ NEW: The Doggy Depot

... continues ...

📊 SCRAPING STATS:
==================================================
Total processed: 523
New entries:     412
Updated:         111
Errors:          0
==================================================
```

## Error Handling

- Automatic retries on network errors
- Skips businesses with invalid data
- Continues scraping even if individual businesses fail
- Logs all errors for review

## Rate Limiting

- 3-6 second delay between business scrapes
- 1-2 second delay between scrolls
- 2-4 second delay between metro areas
- Prevents IP blocking and respects Google's servers

## Best Practices

1. **Run during off-peak hours** (late night/early morning)
2. **Start with priority metros** (`npm run scrape`)
3. **Monitor for errors** and adjust delays if needed
4. **Run weekly/monthly** to keep data fresh
5. **Don't abuse** - respect rate limits

## Troubleshooting

**Browser won't launch:**
```bash
npx playwright install chromium
```

**Database connection error:**
```bash
export DATABASE_URL="postgresql://user:pass@host:5432/db"
```

**Too many errors:**
- Increase delay times in code (currently 3-6 seconds)
- Run scraper less frequently
- Check Google Maps isn't blocking your IP

## Legal & Ethical

- ✅ Data is publicly available on Google Maps
- ✅ Proper attribution in UI ("Rating from Google Maps")
- ✅ Links drive traffic TO businesses (not aggregating)
- ✅ Rate limiting prevents server abuse
- ✅ No private/paywalled data collected

## Roadmap

- [ ] Parallel scraping (multiple browsers)
- [ ] Proxy rotation support
- [ ] Resume from checkpoint on failure
- [ ] Extract business hours
- [ ] Extract amenities/services
- [ ] Photo URLs extraction

---

**Last Updated:** October 2025
**Maintainer:** Woof Spots Team
