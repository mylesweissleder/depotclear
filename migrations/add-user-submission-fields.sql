-- Migration: Add user submission support to dog_daycares table
-- This allows businesses to be added by users, not just scraped
-- Date: 2025-10-24

-- Add data source tracking
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS data_source VARCHAR(50) DEFAULT 'scraped';

COMMENT ON COLUMN dog_daycares.data_source IS 'Source of data: scraped | user_submitted | user_claimed | manual';

-- Add verification status
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'unverified';

COMMENT ON COLUMN dog_daycares.verification_status IS 'Verification status: unverified | pending | verified | rejected';

-- Add submission tracking
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS submitted_by_email TEXT,
ADD COLUMN IF NOT EXISTS submitted_by_name TEXT,
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

COMMENT ON COLUMN dog_daycares.submitted_by_email IS 'Email of person who submitted this business (if user_submitted)';
COMMENT ON COLUMN dog_daycares.submitted_by_name IS 'Name of person who submitted this business';
COMMENT ON COLUMN dog_daycares.submitted_at IS 'When this business was submitted by a user';

-- Add admin review fields
ALTER TABLE dog_daycares
ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS review_notes TEXT;

COMMENT ON COLUMN dog_daycares.reviewed_by IS 'Admin user who reviewed this submission';
COMMENT ON COLUMN dog_daycares.reviewed_at IS 'When this submission was reviewed';
COMMENT ON COLUMN dog_daycares.review_notes IS 'Admin notes about this submission';

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_dog_daycares_data_source
  ON dog_daycares(data_source);

CREATE INDEX IF NOT EXISTS idx_dog_daycares_verification_status
  ON dog_daycares(verification_status);

CREATE INDEX IF NOT EXISTS idx_dog_daycares_pending_review
  ON dog_daycares(verification_status, submitted_at)
  WHERE verification_status = 'pending';

-- View for admin dashboard: pending submissions
CREATE OR REPLACE VIEW pending_submissions AS
SELECT
  id,
  name,
  city,
  state,
  address,
  phone,
  website,
  submitted_by_name,
  submitted_by_email,
  submitted_at,
  data_source,
  verification_status,
  EXTRACT(EPOCH FROM (NOW() - submitted_at))/3600 AS hours_pending
FROM dog_daycares
WHERE verification_status = 'pending'
ORDER BY submitted_at ASC;

COMMENT ON VIEW pending_submissions IS 'Admin dashboard view of user-submitted businesses awaiting approval';

-- View for recently approved submissions
CREATE OR REPLACE VIEW recently_approved_submissions AS
SELECT
  id,
  name,
  city,
  state,
  submitted_by_name,
  submitted_by_email,
  submitted_at,
  reviewed_by,
  reviewed_at,
  verification_status
FROM dog_daycares
WHERE verification_status = 'verified'
  AND reviewed_at > NOW() - INTERVAL '7 days'
ORDER BY reviewed_at DESC;

COMMENT ON VIEW recently_approved_submissions IS 'Recently approved user submissions (last 7 days)';

-- Function to approve a submission
CREATE OR REPLACE FUNCTION approve_submission(
  submission_id INTEGER,
  admin_email TEXT,
  notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    verification_status = 'verified',
    reviewed_by = admin_email,
    reviewed_at = NOW(),
    review_notes = notes,
    updated_at = NOW()
  WHERE id = submission_id
    AND verification_status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION approve_submission IS 'Approve a pending user submission';

-- Function to reject a submission
CREATE OR REPLACE FUNCTION reject_submission(
  submission_id INTEGER,
  admin_email TEXT,
  reason TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE dog_daycares
  SET
    verification_status = 'rejected',
    reviewed_by = admin_email,
    reviewed_at = NOW(),
    review_notes = reason,
    updated_at = NOW()
  WHERE id = submission_id
    AND verification_status = 'pending';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION reject_submission IS 'Reject a pending user submission with reason';

-- Function to submit a new business (used by API)
CREATE OR REPLACE FUNCTION submit_business(
  p_name TEXT,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_zip TEXT,
  p_phone TEXT,
  p_website TEXT,
  p_submitter_name TEXT,
  p_submitter_email TEXT
)
RETURNS INTEGER AS $$
DECLARE
  new_id INTEGER;
BEGIN
  INSERT INTO dog_daycares (
    name,
    address,
    city,
    state,
    phone,
    website,
    data_source,
    verification_status,
    submitted_by_name,
    submitted_by_email,
    submitted_at,
    created_at,
    updated_at
  )
  VALUES (
    p_name,
    p_address,
    p_city,
    p_state,
    p_phone,
    p_website,
    'user_submitted',
    'pending',
    p_submitter_name,
    p_submitter_email,
    NOW(),
    NOW(),
    NOW()
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION submit_business IS 'Submit a new business for review (called by API endpoint)';

-- Stats view for tracking submission activity
CREATE OR REPLACE VIEW submission_stats AS
SELECT
  data_source,
  verification_status,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days') as count_last_7_days,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '30 days') as count_last_30_days
FROM dog_daycares
GROUP BY data_source, verification_status
ORDER BY data_source, verification_status;

COMMENT ON VIEW submission_stats IS 'Statistics on submissions by source and verification status';
