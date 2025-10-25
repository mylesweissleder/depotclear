-- Add ZIP code tracking to votes and newsletter subscribers

-- Add ZIP code to pup_votes table
ALTER TABLE pup_votes
ADD COLUMN IF NOT EXISTS voter_zip VARCHAR(10);

-- Add ZIP code to newsletter_subscribers table
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(10);

-- Create index for ZIP code lookups (for geo-targeted newsletters)
CREATE INDEX IF NOT EXISTS idx_newsletter_zip_code
ON newsletter_subscribers(zip_code)
WHERE zip_code IS NOT NULL AND subscribed = TRUE;

-- Create index for vote ZIP codes (for analytics)
CREATE INDEX IF NOT EXISTS idx_votes_zip_code
ON pup_votes(voter_zip)
WHERE voter_zip IS NOT NULL;

COMMENT ON COLUMN pup_votes.voter_zip IS 'Voter ZIP code for geo-targeted recommendations';
COMMENT ON COLUMN newsletter_subscribers.zip_code IS 'Subscriber ZIP code for localized content';
