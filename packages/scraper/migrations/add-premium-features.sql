-- Premium Features Database Schema
-- Tables for business owner authentication, claims, subscriptions, and analytics

-- Users table (business owners)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      phone VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login_at TIMESTAMP,
      email_verified BOOLEAN DEFAULT false,
      email_verification_token VARCHAR(255),
      password_reset_token VARCHAR(255),
      password_reset_expires TIMESTAMP
    );
  END IF;
END $$;

-- Add missing columns to users table if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='email_verification_token') THEN
    ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_reset_token') THEN
    ALTER TABLE users ADD COLUMN password_reset_token VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='password_reset_expires') THEN
    ALTER TABLE users ADD COLUMN password_reset_expires TIMESTAMP;
  END IF;
END $$;

-- Create indexes
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email') THEN
    CREATE INDEX idx_users_email ON users(email);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_email_verification') THEN
    CREATE INDEX idx_users_email_verification ON users(email_verification_token);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_users_password_reset') THEN
    CREATE INDEX idx_users_password_reset ON users(password_reset_token);
  END IF;
END $$;

-- Business claims (links users to daycares)
CREATE TABLE IF NOT EXISTS business_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  verification_method VARCHAR(50), -- email, phone, manual
  verification_token VARCHAR(255),
  verified_at TIMESTAMP,
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, daycare_id)
);

CREATE INDEX IF NOT EXISTS idx_claims_user ON business_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_daycare ON business_claims(daycare_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON business_claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_verification ON business_claims(verification_token);

-- Subscriptions (premium plans)
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- basic, premium, enterprise
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, cancelled, expired, past_due
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  cancel_at_period_end BOOLEAN DEFAULT false,
  cancelled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_daycare ON subscriptions(daycare_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);

-- Premium content (custom photos, descriptions, etc.)
CREATE TABLE IF NOT EXISTS premium_content (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  custom_description TEXT,
  custom_tagline VARCHAR(255),
  premium_photos JSONB, -- Array of custom uploaded photo URLs
  video_url TEXT,
  social_links JSONB, -- {facebook: "", instagram: "", twitter: ""}
  certifications JSONB, -- Array of certification names/images
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(daycare_id)
);

CREATE INDEX IF NOT EXISTS idx_premium_content_daycare ON premium_content(daycare_id);

-- Special offers/promotions
CREATE TABLE IF NOT EXISTS special_offers (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(50), -- percentage, fixed_amount, free_day
  discount_value DECIMAL(10, 2),
  valid_from TIMESTAMP,
  valid_until TIMESTAMP,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_offers_daycare ON special_offers(daycare_id);
CREATE INDEX IF NOT EXISTS idx_offers_active ON special_offers(active);
CREATE INDEX IF NOT EXISTS idx_offers_valid ON special_offers(valid_from, valid_until);

-- Analytics events (page views, clicks, conversions)
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL, -- page_view, website_click, phone_click, maps_click
  user_agent TEXT,
  ip_address VARCHAR(50),
  referrer TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_daycare ON analytics_events(daycare_id);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- Analytics summary (aggregated daily stats)
CREATE TABLE IF NOT EXISTS analytics_summary (
  id SERIAL PRIMARY KEY,
  daycare_id INTEGER NOT NULL REFERENCES dog_daycares(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  website_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  maps_clicks INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(daycare_id, date)
);

CREATE INDEX IF NOT EXISTS idx_analytics_summary_daycare ON analytics_summary(daycare_id);
CREATE INDEX IF NOT EXISTS idx_analytics_summary_date ON analytics_summary(date);

-- Add premium fields to dog_daycares table
ALTER TABLE dog_daycares
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP,
  ADD COLUMN IF NOT EXISTS custom_description TEXT,
  ADD COLUMN IF NOT EXISTS custom_tagline VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_dog_daycares_premium ON dog_daycares(is_premium);
CREATE INDEX IF NOT EXISTS idx_dog_daycares_verified ON dog_daycares(is_verified);
CREATE INDEX IF NOT EXISTS idx_dog_daycares_featured ON dog_daycares(featured, featured_until);
