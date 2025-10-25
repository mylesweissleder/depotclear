-- Add tier system for dog daycare listings
-- Supports: unclaimed (default), claimed (free), top_dog (paid)

-- Add tier column with enum type
CREATE TYPE listing_tier AS ENUM ('unclaimed', 'claimed', 'top_dog');

ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS tier listing_tier DEFAULT 'unclaimed';

-- Add tier-related timestamps
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS top_dog_since TIMESTAMP,
ADD COLUMN IF NOT EXISTS top_dog_until TIMESTAMP;

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
CREATE INDEX IF NOT EXISTS idx_daycares_top_dog_until ON dog_daycares(top_dog_until) WHERE tier = 'top_dog';
CREATE INDEX IF NOT EXISTS idx_daycares_stripe_customer ON dog_daycares(stripe_customer_id) WHERE stripe_customer_id IS NOT NULL;

-- Create index for searching Top Dog listings first
CREATE INDEX IF NOT EXISTS idx_daycares_tier_rating
ON dog_daycares(tier DESC, rating DESC NULLS LAST, review_count DESC NULLS LAST);

-- Comments for documentation
COMMENT ON COLUMN dog_daycares.tier IS 'Listing tier: unclaimed (default, limited info), claimed (free with contact), top_dog (paid, all features)';
COMMENT ON COLUMN dog_daycares.claimed_at IS 'When the business owner claimed this listing';
COMMENT ON COLUMN dog_daycares.top_dog_since IS 'When Top Dog subscription started';
COMMENT ON COLUMN dog_daycares.top_dog_until IS 'When Top Dog subscription expires (NULL = active monthly)';
COMMENT ON COLUMN dog_daycares.stripe_customer_id IS 'Stripe customer ID for billing';
COMMENT ON COLUMN dog_daycares.stripe_subscription_id IS 'Stripe subscription ID';
COMMENT ON COLUMN dog_daycares.verified IS 'Whether business ownership has been verified';

-- Function to check if Top Dog is active
CREATE OR REPLACE FUNCTION is_top_dog_active(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  tier_val listing_tier;
  expiry_date TIMESTAMP;
BEGIN
  SELECT tier, top_dog_until INTO tier_val, expiry_date
  FROM dog_daycares
  WHERE id = daycare_id;

  IF tier_val = 'top_dog' THEN
    -- If top_dog_until is NULL, it's an active monthly subscription
    -- If top_dog_until is set, check if it's in the future
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

-- Function to upgrade listing to Top Dog
CREATE OR REPLACE FUNCTION upgrade_to_top_dog(
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
    tier = 'top_dog',
    top_dog_since = NOW(),
    top_dog_until = expiry_date,
    stripe_customer_id = customer_id,
    stripe_subscription_id = subscription_id,
    subscription_status = 'active',
    updated_at = NOW()
  WHERE id = daycare_id AND tier IN ('unclaimed', 'claimed');

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to downgrade from Top Dog (on cancellation)
CREATE OR REPLACE FUNCTION downgrade_from_top_dog(daycare_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    tier = 'claimed', -- Downgrade to claimed, not unclaimed
    subscription_status = 'canceled',
    updated_at = NOW()
  WHERE id = daycare_id AND tier = 'top_dog';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- View for Top Dog listings dashboard
CREATE OR REPLACE VIEW top_dog_listings_summary AS
SELECT
  id,
  name,
  city,
  state,
  tier,
  claimed_at,
  top_dog_since,
  top_dog_until,
  subscription_status,
  stripe_customer_id,
  CASE
    WHEN tier = 'top_dog' AND (top_dog_until IS NULL OR top_dog_until > NOW()) THEN 'Active'
    WHEN tier = 'top_dog' AND top_dog_until <= NOW() THEN 'Expired'
    WHEN tier = 'claimed' THEN 'Free Claimed'
    ELSE 'Unclaimed'
  END AS status_display,
  CASE
    WHEN top_dog_until IS NULL THEN 'Monthly ($99/mo)'
    ELSE 'Annual ($990/yr)'
  END AS plan_type
FROM dog_daycares
WHERE tier IN ('claimed', 'top_dog')
ORDER BY tier DESC, top_dog_since DESC NULLS LAST;

COMMENT ON VIEW top_dog_listings_summary IS 'Dashboard view of all claimed and Top Dog listings';
