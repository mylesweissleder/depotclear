-- Newsletter Editions: Weekly topics (52 rows total, one per week)
CREATE TABLE IF NOT EXISTS newsletter_editions (
  id SERIAL PRIMARY KEY,
  week_number INT NOT NULL UNIQUE,    -- 1-52
  topic VARCHAR(255) NOT NULL,        -- "How to Choose a Dog Daycare"
  content_type VARCHAR(50),           -- "how-to" | "metro-guide" | "seasonal" | "comparison"
  scheduled_send TIMESTAMP,           -- When to send this edition
  sent_at TIMESTAMP,                  -- When it was actually sent
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Content: Metro-specific content for each edition
-- Each edition has 51 rows: 50 metros + 1 generic (metro = NULL)
CREATE TABLE IF NOT EXISTS newsletter_content (
  id SERIAL PRIMARY KEY,
  edition_id INT NOT NULL REFERENCES newsletter_editions(id) ON DELETE CASCADE,
  metro VARCHAR(100),                 -- "san-francisco" | NULL for generic

  -- Content sections
  headline TEXT NOT NULL,             -- "San Francisco: How to Choose a Dog Daycare"
  intro_text TEXT,                    -- Opening paragraph
  local_tip TEXT,                     -- Metro-specific advice
  fun_fact TEXT,                      -- Local dog culture fact
  cta_text TEXT,                      -- Call-to-action button text
  cta_url TEXT,                       -- CTA link (e.g., "/metro/san-francisco")

  -- Provider highlighting (optional - can query live)
  featured_provider_ids JSONB,       -- [123, 456, 789] - IDs from dog_care_providers

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(edition_id, metro)
);

-- Newsletter Sends: Track each send batch
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id SERIAL PRIMARY KEY,
  edition_id INT NOT NULL REFERENCES newsletter_editions(id),
  metro VARCHAR(100),                 -- Which metro batch was sent

  -- Batch stats
  subscriber_count INT DEFAULT 0,     -- How many emails sent
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'pending', -- pending | in_progress | completed | failed

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Newsletter Analytics: Track engagement per metro
CREATE TABLE IF NOT EXISTS newsletter_analytics (
  id SERIAL PRIMARY KEY,
  edition_id INT NOT NULL REFERENCES newsletter_editions(id),
  metro VARCHAR(100),                 -- NULL for aggregated stats

  -- Metrics
  sent_count INT DEFAULT 0,
  opened_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,
  unsubscribed_count INT DEFAULT 0,
  bounced_count INT DEFAULT 0,

  -- Calculated rates (updated via trigger or cron)
  open_rate DECIMAL(5,2),             -- 45.23%
  click_rate DECIMAL(5,2),            -- 12.45%
  unsubscribe_rate DECIMAL(5,2),      -- 0.23%

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(edition_id, metro)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_content_edition
  ON newsletter_content(edition_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_content_metro
  ON newsletter_content(metro);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_edition
  ON newsletter_sends(edition_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_analytics_edition
  ON newsletter_analytics(edition_id);

-- Trigger to update updated_at on newsletter_content
CREATE OR REPLACE FUNCTION update_newsletter_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_content_updated_at
  BEFORE UPDATE ON newsletter_content
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_content_updated_at();

-- Sample data: Week 1 edition
INSERT INTO newsletter_editions (week_number, topic, content_type, scheduled_send)
VALUES (
  1,
  'San Francisco Bay Area Guide: Top Daycares with Indoor Play',
  'metro-guide',
  CURRENT_TIMESTAMP + INTERVAL '7 days'
) ON CONFLICT (week_number) DO NOTHING;

-- Sample content for SF metro
INSERT INTO newsletter_content (edition_id, metro, headline, intro_text, local_tip, fun_fact, cta_text, cta_url)
VALUES (
  1,
  'san-francisco',
  'San Francisco Bay Area: Top Daycares with Indoor Play',
  'Winter is here in the Bay Area, and finding a daycare with great indoor facilities is key for keeping your pup active on rainy days.',
  'Many SF daycares offer webcam access so you can check in on your pup throughout the day. Look for facilities with "live cam" in their amenities.',
  'Tech workers in San Francisco prefer French Bulldogs and Corgis - breeds well-suited for apartment living and public transit.',
  'Explore SF Daycares',
  'https://woofspots.com/metro/san-francisco'
) ON CONFLICT (edition_id, metro) DO NOTHING;

-- Sample content for generic (metro = NULL)
INSERT INTO newsletter_content (edition_id, metro, headline, intro_text, local_tip, fun_fact, cta_text, cta_url)
VALUES (
  1,
  NULL,
  'Finding the Perfect Dog Daycare for Winter',
  'As winter weather sets in, finding a daycare with indoor facilities becomes crucial for your pup''s health and happiness.',
  'Look for daycares with climate-controlled indoor play areas, especially if you live in an area with harsh winters.',
  'Studies show that dogs who attend daycare 2-3 times per week exhibit less separation anxiety and better social skills.',
  'Find Daycares Near You',
  'https://woofspots.com/search'
) ON CONFLICT (edition_id, metro) DO NOTHING;
