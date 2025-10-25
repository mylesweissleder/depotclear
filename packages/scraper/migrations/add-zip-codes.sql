-- Add ZIP code tracking for newsletter segmentation by metro
-- This allows us to send localized weekly newsletters based on user location

-- Add ZIP code to pup_votes table
ALTER TABLE pup_votes
ADD COLUMN IF NOT EXISTS voter_zip VARCHAR(5);

CREATE INDEX IF NOT EXISTS idx_pup_votes_zip ON pup_votes(voter_zip);

-- Add ZIP code to newsletter_subscribers table
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(5);

CREATE INDEX IF NOT EXISTS idx_newsletter_zip ON newsletter_subscribers(zip_code);

-- Add metro/region field for grouping (derived from ZIP code)
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS metro VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_newsletter_metro ON newsletter_subscribers(metro);

COMMENT ON COLUMN pup_votes.voter_zip IS 'ZIP code for geographic segmentation';
COMMENT ON COLUMN newsletter_subscribers.zip_code IS 'ZIP code for localized content delivery';
COMMENT ON COLUMN newsletter_subscribers.metro IS 'Metro area derived from ZIP code for newsletter segmentation';
