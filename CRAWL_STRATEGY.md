# DepotClear Store Crawling Strategy

## 🎯 Goal: Find "Penny Deals" at Every Store

Users LOVE finding items for $0.01, $0.03, $0.06 — these are the "holy grail" clearance items.

---

## 📊 The Numbers

### Home Depot Store Count
- **Total US Stores**: 2,300
- **Categories to track**: Tools, Lighting, Hardware, Paint, Outdoor (5 categories)
- **Pages per category**: 2 (top 100 items per category)
- **Requests per store**: 10 (5 categories × 2 pages)

### Crawl Performance
| Metric | Value |
|--------|-------|
| Avg request time | 3 seconds (with rate limiting) |
| Time per store | ~30 seconds |
| **Stores per hour** | **120 stores** |
| **Stores per day (24/7)** | **2,880 stores** |
| **Full nationwide scan** | **1 day** ✅ |

---

## 🚀 Smart Crawl Strategy (Tiered Approach)

Instead of blindly crawling all 2,300 stores equally, we prioritize:

### Tier 1: Hot Zones (50 stores)
**Who**: Major metros (NYC, LA, Chicago, Houston, Phoenix, Dallas, Miami, SF, Seattle, Boston)
**Frequency**: Every 6 hours (4x per day)
**Why**:
- Highest user concentration (70% of users likely in top 50 cities)
- Fresh data = more excitement = more shares
- These stores have the most inventory turnover

**Example stores**:
- Home Depot - Manhattan Chelsea
- Home Depot - Downtown LA
- Home Depot - Chicago Loop
- Home Depot - Houston Westheimer
- etc.

### Tier 2: Regional Coverage (200 stores)
**Who**: Top 100 US cities (2 stores per city)
**Frequency**: Every 12 hours (2x per day)
**Why**:
- Covers ~80% of US population
- Still very fresh data
- Manageable server load

### Tier 3: On-Demand + Weekly (2,050 stores)
**Who**: Smaller cities, rural areas
**Frequency**:
- Weekly automatic refresh
- On-demand when user searches that ZIP code (cached for 24 hours)
**Why**:
- Still 100% coverage
- Resource-efficient
- Users get fresh data when they need it

---

## 💎 Penny Deal Alert System

### How It Works
1. **During each crawl**, flag items with:
   - Price ≤ $1.00
   - Price ending in .01, .03, .06
   - Discount > 90%

2. **Store in database**:
```sql
INSERT INTO penny_deals (product_id, store_id, price, found_at)
VALUES ('12345', 'HD-001', 0.03, NOW());
```

3. **Notify users**:
   - Push notification: "🔥 3 new penny deals at Home Depot Pasadena (2.3 miles away)"
   - Email digest: "Your weekly penny deal roundup"
   - In-app badge: "🆕 12 new deals near you"

---

## 📅 Example Crawl Schedule

### Every 6 Hours (Tier 1)
```
00:00 - Crawl 50 Tier 1 stores (takes ~25 min)
06:00 - Crawl 50 Tier 1 stores
12:00 - Crawl 50 Tier 1 stores + 100 Tier 2 stores (takes ~75 min)
18:00 - Crawl 50 Tier 1 stores
```

### Every 12 Hours (Tier 2)
```
00:00 - Crawl 100 Tier 2 stores (takes ~50 min)
12:00 - Crawl 100 Tier 2 stores
```

### Weekly (Tier 3)
```
Sunday 2:00 AM - Crawl all 2,050 Tier 3 stores (takes ~17 hours)
```

### On-Demand (Any Tier)
```
When user searches ZIP code:
- Check if we have data < 24 hours old → serve cached
- If not → trigger immediate crawl for that store → cache result
```

---

## 🔥 User Experience: "Hot Deals Near Me"

### Landing Page Feature
```
🔥 PENNY DEALS NEAR YOU

📍 Enter your ZIP: [90210] [Find Deals]

Results:
┌─────────────────────────────────────────┐
│ 🏪 Home Depot - Pasadena (2.3 mi)       │
│ 💰 3 items under $1 found 2 hours ago   │
│                                          │
│ • LED Work Light - $0.03 (was $29.99)   │
│ • Door Hinges 6pk - $0.06 (was $12.99)  │
│ • Paint Gallon - $0.88 (was $34.99)     │
│                                          │
│ [View All Deals →]                       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🏪 Home Depot - Glendale (4.1 mi)       │
│ 💰 1 item under $1 found 5 hours ago    │
│                                          │
│ • Cordless Drill Battery - $0.01 !!!    │
│                                          │
│ [View All Deals →]                       │
└─────────────────────────────────────────┘
```

### Email Alert Example
```
Subject: 🚨 PENNY DEAL ALERT: $0.01 Battery at Your Local Store!

Hi [Name],

We just found a PENNY DEAL near you:

🔥 Cordless Drill Battery Pack (18V)
💰 $0.01 (was $49.99) - 99.9% OFF!
📍 Home Depot - Glendale (4.1 miles)
⏰ Found 12 minutes ago

This won't last! Go now →

[View on Map] [Get Directions]

---
Your DepotClear alerts are finding you $X,XXX in savings
[Manage preferences] [Unsubscribe]
```

---

## 💰 Resource Costs

### Server Load
**Tier 1 (4x per day)**:
- 50 stores × 30 sec = 25 min per run
- 4 runs per day = 100 min/day
- Minimal server cost

**Tier 2 (2x per day)**:
- 200 stores × 30 sec = 100 min per run
- 2 runs per day = 200 min/day

**Tier 3 (1x per week)**:
- 2,050 stores × 30 sec = 1,025 min (17 hours)
- Once per week = 146 min/day average

**Total daily crawling**: ~6.5 hours
**Server idle time**: 17.5 hours (can use for on-demand requests)

### API Costs
- OpenAI API: Only used for weekly trend summaries (~$5/week)
- Database: Supabase Pro ($25/mo) handles millions of rows easily
- Vercel: Pro plan ($20/mo) supports background functions

**Total monthly cost at scale**: ~$50/mo
**Cost per user**: $0.05/mo (at 1,000 users)

---

## 🎯 Conversion Strategy

### Free Tier (Demo)
- Show Tier 1 stores only (50 stores)
- Limit to 10 search results
- No email alerts
- Data refreshed every 12 hours

**Goal**: Get users hooked on finding deals

### Paid Tier ($29 one-time)
- ALL 2,300 stores
- Unlimited searches
- Email + push notifications for penny deals
- Data refreshed every 6 hours (Tier 1) or 12 hours (Tier 2)
- Priority: On-demand store crawls (instant results)

**Goal**: Convert after they see 1-2 amazing deals

---

## 📈 Viral Growth Potential

### User-Generated Content
When users find a $0.01 item, they'll:
1. **Take a photo** (receipt/item)
2. **Share on social media**
   - "Just got a $50 drill battery for ONE PENNY thanks to @DepotClear!"
3. **Tag friends**
4. **Post in bargain hunting communities**

### Gamification
- Leaderboard: "Top penny hunters this month"
- Badges: "Found 10 items under $0.10"
- Savings tracker: "You've saved $XXX using DepotClear"

---

## 🚀 Launch Strategy

### Week 1: Tier 1 Only (50 stores)
- Test reliability
- Gather user feedback
- Ensure data quality

### Week 2-3: Add Tier 2 (250 total stores)
- Scale infrastructure
- Monitor server costs
- Implement caching

### Week 4: Full Launch (2,300 stores)
- Tier 3 weekly crawls
- On-demand crawling
- Email alerts

---

## 🎁 Future Enhancements

1. **Crowdsourced Verification**
   - Users upload receipt photos
   - Verify deals are still available
   - Earn points for contributions

2. **Heatmap View**
   - Map showing stores with most penny deals
   - Color-coded by deal density

3. **Store Profiles**
   - Historical data per store
   - "Best time to visit" recommendations
   - Clearance markdown schedule patterns

4. **Reseller Tools** (Premium $99)
   - Bulk export deals
   - API access
   - Real-time inventory tracking
   - Profit calculator (resale value estimates)

---

## ✅ Technical Implementation

### Database Schema Addition
```sql
-- Store-specific penny deals
CREATE TABLE penny_deals (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50),
  store_id VARCHAR(50),
  store_name VARCHAR(200),
  price DECIMAL(10, 2),
  original_price DECIMAL(10, 2),
  title VARCHAR(500),
  category VARCHAR(100),
  found_at TIMESTAMP DEFAULT NOW(),
  last_verified TIMESTAMP,
  is_verified BOOLEAN DEFAULT false,

  INDEX idx_store_id (store_id),
  INDEX idx_found_at (found_at DESC),
  INDEX idx_price (price) WHERE price <= 1.00
);

-- Store crawl status
CREATE TABLE store_crawl_status (
  store_id VARCHAR(50) PRIMARY KEY,
  store_name VARCHAR(200),
  tier INT, -- 1, 2, or 3
  last_crawled TIMESTAMP,
  next_crawl TIMESTAMP,
  crawl_frequency VARCHAR(20), -- '6h', '12h', '1w', 'on-demand'
  items_found INT,
  penny_deals_found INT
);
```

### Cron Configuration
```javascript
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/crawl-tier1",
      "schedule": "0 */6 * * *"  // Every 6 hours
    },
    {
      "path": "/api/cron/crawl-tier2",
      "schedule": "0 0,12 * * *"  // Every 12 hours (midnight, noon)
    },
    {
      "path": "/api/cron/crawl-tier3",
      "schedule": "0 2 * * 0"  // Sunday 2 AM
    }
  ]
}
```

---

## 🏁 Bottom Line

**Yes, we CAN crawl all 2,300 stores!**

- ✅ Full nationwide coverage in 1 day (if needed)
- ✅ Smart tiering keeps costs low ($50/mo)
- ✅ Hot zones get fresh data every 6 hours
- ✅ On-demand crawling for any store
- ✅ Penny deal alerts drive viral growth
- ✅ Scalable infrastructure

**This is the killer feature that makes DepotClear worth $29.**
