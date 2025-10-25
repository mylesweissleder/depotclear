-- Add tier system for dog daycare listings
-- Supports: unclaimed (default), claimed (free), premium (paid)

-- Add tier column with enum type
CREATE TYPE listing_tier AS ENUM ('unclaimed', 'claimed', 'premium');

ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS tier listing_tier DEFAULT 'unclaimed';

-- Add tier-related timestamps
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS premium_since TIMESTAMP,
ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP;

-- Add Stripe integration fields
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT; -- active, canceled, past_due, etc.

-- Add claimed_by information
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS claimed_by_email TEXT,
ADD COLUMN IF NOT EXISTS claimed_by_name TEXT;

-- Add verification fields
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_method TEXT; -- email, phone, document

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_daycares_tier ON dog_daycares(tier);
CREATE INDEX IF NOT EXISTS idx_daycares_premium_until ON dog_daycares(premium_until) WHERE tier = 'premium';
CREATE INDEX IF NOT EXISTS idx_daycares_stripe_customer ON dog_daycares(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Create index for searching premium listings first
CREATE INDEX IF NOT EXISTS idx_daycares_tier_rating
ON dog_daycares(tier DESC, rating DESC NULLS LAST, review_count DESC NULLS LAST);

-- Comments for documentation
COMMENT ON COLUMN dog_daycares.tier IS 'Listing tier: unclaimed (default, limited info), claimed (free with contact), premium (paid, all features)';
COMMENT ON COLUMN dog_daycares.claimed_at IS 'When the business owner claimed this listing';
COMMENT ON COLUMN dog_daycares.premium_since IS 'When premium subscription started';
COMMENT ON COLUMN dog_daycares.premium_until IS 'When premium subscription expires (NULL = active monthly)';
COMMENT ON COLUMN dog_daycares.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN dog_daycares.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN dog_daycares.verified IS 'Whether business ownership has been verified';

-- Function to check if premium is active
CREATE OR REPLACE FUNCTION is_premium_active(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  tier_val listing_tier;
  expiry_date TIMESTAMP;
BEGIN
  SELECT tier, premium_until INTO tier_val, expiry_date
  FROM dog_daycares
  WHERE id = daycare_id;

  IF tier_val = 'premium' THEN
    -- If premium_until is NULL, it's an active monthly subscription
    -- If premium_until is set, check if it's in the future
    RETURN (expiry_date IS NULL OR expiry_date > NOW());
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade listing to claimed
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
    updated_at = NOW()
  WHERE id = daycare_id AND tier = 'unclaimed';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to upgrade listing to premium
CREATE OR REPLACE FUNCTION upgrade_to_premium(
  daycare_id INTEGER,
  customer_id TEXT,
  subscription_id TEXT,
  is_annual BOOLEAN DEFAULT FALSE
)
RETURNS BOOLEAN AS $$
DECLARE
  expiry_date TIMESTAMP;
BEGIN
  -- Set expiry date for annual subscriptions
  IF is_annual THEN
    expiry_date := NOW() + INTERVAL '1 year';
  ELSE
    expiry_date := NULL; -- NULL for monthly (managed by Stripe)
  END IF;

  UPDATE dog_daycares
  SET
    tier = 'premium',
    premium_since = NOW(),
    premium_until = expiry_date,
    stripe_customer_id = customer_id,
    stripe_subscription_id = subscription_id,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE id = daycare_id AND tier IN ('unclaimed', 'claimed');

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to downgrade from premium (on cancellation)
CREATE OR REPLACE FUNCTION downgrade_from_premium(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    tier = 'claimed', -- Downgrade to claimed, not unclaimed
    subscription_status = 'canceled',
    updated_at = NOW()
  WHERE id = daycare_id AND tier = 'premium';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- View for premium listings dashboard
CREATE OR REPLACE VIEW premium_listings_summary AS
SELECT
  id,
  name,
  city,
  state,
  tier,
  claimed_at,
  premium_since,
  premium_until,
  subscription_status,
  stripe_customer_id,
  CASE
    WHEN tier = 'premium' AND (premium_until IS NULL OR premium_until > NOW()) THEN 'Active'
    WHEN tier = 'premium' AND premium_until <= NOW() THEN 'Expired'
    WHEN tier = 'claimed' THEN 'Free Claimed'
    ELSE 'Unclaimed'
  END AS status_display,
  CASE
    WHEN premium_until IS NULL THEN 'Monthly ($99/mo)'
    ELSE 'Annual ($990/yr)'
  END AS plan_type
FROM dog_daycares
WHERE tier IN ('claimed', 'premium')
ORDER BY tier DESC, premium_since DESC NULLS LAST;

COMMENT ON VIEW premium_listings_summary IS 'Dashboard view of all claimed and premium listings';
