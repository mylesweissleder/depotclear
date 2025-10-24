-- Create newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  normalized_email TEXT NOT NULL, -- For deduplication
  source TEXT DEFAULT 'contest_vote', -- Where they signed up (contest_vote, homepage, etc.)

  -- Status
  subscribed BOOLEAN DEFAULT TRUE,
  confirmed BOOLEAN DEFAULT FALSE, -- For double opt-in (future)

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,

  -- Timestamps
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_normalized_email ON newsletter_subscribers(normalized_email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribed ON newsletter_subscribers(subscribed) WHERE subscribed = TRUE;
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscribers(source);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER newsletter_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_newsletter_updated_at();
