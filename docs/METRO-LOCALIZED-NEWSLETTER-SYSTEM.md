# Metro-Localized Newsletter System

## Overview
Instead of sending the same newsletter to all subscribers, we send **metro-specific newsletters** where each city gets customized local content. Subscribers in San Francisco get SF-specific providers, contest winners, and tips, while NYC subscribers get NYC-specific content.

## How It Works

### 1. Metro Segmentation (Already Built)
When users vote in the contest, we collect their ZIP code and automatically map it to one of our 50 metro areas:

```typescript
// User in SF enters ZIP 94102
zipToMetro("94102") → { metro: "san-francisco", region: "bay-area" }

// Stored in newsletter_subscribers table
{
  email: "user@example.com",
  zip_code: "94102",
  metro: "san-francisco"  // Used for segmentation
}
```

### 2. Weekly Newsletter Topics (Same Headline, Different Content)

Each week has a **universal topic** that applies to all metros, but the **content is localized**:

#### Example: Week 2 - "How to Choose a Dog Daycare"

**San Francisco Newsletter:**
```
Subject: SF Bay Area: How to Choose a Dog Daycare 🐕

📍 Top-Rated SF Daycares This Week:
- Wag Hotels - SoMa (4.8★, 234 reviews)
- The Dog House - Mission (4.7★, 189 reviews)
- Doggie Daycare SF - Castro (4.6★, 156 reviews)

🏆 This Week's SF Contest Winner:
[Photo of winning pup from SF]

💡 SF-Specific Tip:
"Many SF daycares offer webcams so you can check on your pup during work hours!"

🎯 Local Fun Fact:
Tech workers in SF prefer French Bulldogs and Corgis for apartment living.
```

**New York Newsletter:**
```
Subject: NYC: How to Choose a Dog Daycare 🐕

📍 Top-Rated NYC Daycares This Week:
- Biscuits & Bath - UWS (4.9★, 567 reviews)
- DPAW - Brooklyn (4.8★, 342 reviews)
- NYC Pooch - Chelsea (4.7★, 289 reviews)

🏆 This Week's NYC Contest Winner:
[Photo of winning pup from NYC]

💡 NYC-Specific Tip:
"Look for daycares with rooftop play areas - a NYC luxury for dogs!"

🎯 Local Fun Fact:
NYC apartment dwellers love small breeds like Yorkies and Cavaliers.
```

**Generic Newsletter (for ZIPs outside service areas):**
```
Subject: How to Choose a Dog Daycare 🐕

📍 Nationwide Top Daycares:
- [Top rated providers from all metros]

🏆 This Week's Contest Winners:
[Top 3 winners from all metros combined]

💡 General Tip:
"Look for daycares with proper licensing and vaccination requirements."
```

### 3. Content Database Schema

```sql
-- Stores newsletter editions
CREATE TABLE newsletter_editions (
  id SERIAL PRIMARY KEY,
  week_number INT NOT NULL,           -- 1-52
  topic VARCHAR(255) NOT NULL,        -- "How to Choose a Dog Daycare"
  content_type VARCHAR(50),           -- "how-to" | "metro-guide" | "seasonal"
  scheduled_send TIMESTAMP,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores metro-specific content for each edition
CREATE TABLE newsletter_content (
  id SERIAL PRIMARY KEY,
  edition_id INT REFERENCES newsletter_editions(id),
  metro VARCHAR(100),                 -- "san-francisco" | NULL for generic

  -- Content sections
  headline TEXT NOT NULL,
  intro_text TEXT,
  featured_providers JSONB,           -- Array of provider IDs
  contest_winner_ids JSONB,           -- Array of submission IDs
  local_tip TEXT,
  fun_fact TEXT,
  cta_text TEXT,
  cta_url TEXT,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(edition_id, metro)
);

-- Index for fast lookups
CREATE INDEX idx_newsletter_content_edition_metro
  ON newsletter_content(edition_id, metro);
```

### 4. Newsletter Generation Flow

```typescript
// API: /api/newsletter/send
// Runs weekly via cron job

async function sendWeeklyNewsletter(weekNumber: number) {
  // 1. Get the edition for this week
  const edition = await getEdition(weekNumber);

  // 2. For each metro, generate localized content
  const metros = await getActiveMetros(); // ["san-francisco", "new-york", ...]

  for (const metro of metros) {
    // 3. Get subscribers in this metro
    const subscribers = await sql`
      SELECT email, zip_code, metro
      FROM newsletter_subscribers
      WHERE metro = ${metro}
        AND subscribed = TRUE
    `;

    // 4. Get localized content for this metro
    const content = await sql`
      SELECT * FROM newsletter_content
      WHERE edition_id = ${edition.id}
        AND metro = ${metro}
    `;

    // 5. Get local providers for this metro
    const providers = await sql`
      SELECT name, rating, review_count, city
      FROM dog_care_providers
      WHERE metro = ${metro}
      ORDER BY rating DESC, review_count DESC
      LIMIT 5
    `;

    // 6. Get local contest winners
    const winners = await sql`
      SELECT s.pup_name, s.photo_url, s.votes
      FROM pup_submissions s
      JOIN pup_votes v ON v.submission_id = s.id
      WHERE v.voter_zip IN (
        SELECT zip_code FROM zip_metro_map WHERE metro = ${metro}
      )
      ORDER BY s.votes DESC
      LIMIT 3
    `;

    // 7. Send personalized email to each subscriber
    for (const subscriber of subscribers.rows) {
      await sendEmail({
        to: subscriber.email,
        subject: `${getMetroDisplayName(metro)}: ${edition.topic}`,
        react: WeeklyNewsletter({
          metro: metro,
          topic: edition.topic,
          providers: providers.rows,
          winners: winners.rows,
          tip: content.rows[0].local_tip,
          funFact: content.rows[0].fun_fact,
        })
      });
    }
  }

  // 8. Send generic newsletter to subscribers outside service areas
  const genericSubscribers = await sql`
    SELECT email FROM newsletter_subscribers
    WHERE metro IS NULL AND subscribed = TRUE
  `;

  const genericContent = await sql`
    SELECT * FROM newsletter_content
    WHERE edition_id = ${edition.id} AND metro IS NULL
  `;

  // ... send generic version
}
```

### 5. Newsletter Template Structure

```tsx
// emails/WeeklyNewsletter.tsx
interface WeeklyNewsletterProps {
  metro: string;           // "san-francisco"
  metroDisplay: string;    // "San Francisco Bay Area"
  topic: string;           // "How to Choose a Dog Daycare"
  providers: Provider[];   // Top 5 local daycares
  winners: Submission[];   // Top 3 local contest entries
  tip: string;             // Metro-specific tip
  funFact: string;         // Local dog culture fact
}

export function WeeklyNewsletter(props: WeeklyNewsletterProps) {
  return (
    <Html>
      <Head />
      <Body>
        {/* Header with metro name */}
        <Heading>{props.metroDisplay} Dog Care Weekly</Heading>

        {/* Topic section */}
        <Section>
          <Heading>{props.topic}</Heading>
        </Section>

        {/* Featured local providers */}
        <Section>
          <Heading>📍 Top-Rated {props.metroDisplay} Daycares</Heading>
          {props.providers.map(p => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </Section>

        {/* Local contest winners */}
        <Section>
          <Heading>🏆 This Week's {props.metroDisplay} Winners</Heading>
          {props.winners.map(w => (
            <WinnerCard key={w.id} submission={w} />
          ))}
        </Section>

        {/* Metro-specific tip */}
        <Section>
          <Text>💡 {props.tip}</Text>
        </Section>

        {/* Local fun fact */}
        <Section>
          <Text>🎯 {props.funFact}</Text>
        </Section>

        {/* CTA to website */}
        <Button href={`https://woofspots.com/metro/${props.metro}`}>
          Explore More in {props.metroDisplay}
        </Button>
      </Body>
    </Html>
  );
}
```

## Benefits of Metro Localization

1. **Higher Engagement:** Users see providers they can actually visit
2. **Better CTR:** Local contest winners are more relatable
3. **Improved Conversions:** Clicking through to local provider pages
4. **A/B Testing:** Compare open rates across metros
5. **Regional Insights:** "Seattle has 30% higher open rates than LA"

## Weekly Send Process

```bash
# Cron job runs every Monday at 9am local time per metro
# Use timezone-aware scheduling

# SF: Monday 9am PST
# NYC: Monday 9am EST
# etc.

# Script:
DATABASE_URL="..." node send-weekly-newsletter.js --week=1
```

## Analytics Tracking

Track per-metro performance:

```sql
CREATE TABLE newsletter_analytics (
  id SERIAL PRIMARY KEY,
  edition_id INT REFERENCES newsletter_editions(id),
  metro VARCHAR(100),

  -- Metrics
  sent_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,

  open_rate DECIMAL(5,2),    -- 45.23%
  click_rate DECIMAL(5,2),   -- 12.45%

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Content Creation Workflow

For each week:

1. **Create universal topic** - "How to Choose a Dog Daycare"
2. **Write 51 metro-specific versions** (50 metros + 1 generic)
3. **Query local providers** from database automatically
4. **Pull contest winners** filtered by voter ZIP
5. **Add metro-specific tip** (manual or AI-generated)
6. **Add fun fact** (manual or AI-generated)

This can be **partially automated** by querying the database for providers and winners, then using AI to generate the tips and fun facts based on metro characteristics.
