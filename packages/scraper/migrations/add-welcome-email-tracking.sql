-- Add field to track if welcome email was sent
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN DEFAULT FALSE;

-- Add timestamp for when welcome email was sent
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP;

-- Add unsubscribe token (if not already exists from other migration)
ALTER TABLE newsletter_subscribers
ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_welcome_sent
ON newsletter_subscribers(welcome_email_sent)
WHERE welcome_email_sent = FALSE AND subscribed = TRUE;

-- Create index for unsubscribe tokens
CREATE INDEX IF NOT EXISTS idx_newsletter_unsubscribe_token
ON newsletter_subscribers(unsubscribe_token)
WHERE unsubscribe_token IS NOT NULL;
