-- Add enhanced Google Maps data fields to dog_daycares table

ALTER TABLE dog_daycares
  -- Business hours (JSONB - {monday: "9 AM-6 PM", tuesday: "9 AM-6 PM", etc.})
  ADD COLUMN IF NOT EXISTS business_hours JSONB,

  -- Business status (open, temporarily_closed, permanently_closed)
  ADD COLUMN IF NOT EXISTS business_status VARCHAR(50) DEFAULT 'open',

  -- Google categories (JSONB array - ["Dog day care center", "Pet boarding service"])
  ADD COLUMN IF NOT EXISTS google_categories JSONB,

  -- Coordinates for mapping
  ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8),

  -- Google Place ID (for reliable updates)
  ADD COLUMN IF NOT EXISTS place_id VARCHAR(255) UNIQUE,

  -- Years in business
  ADD COLUMN IF NOT EXISTS years_in_business INTEGER,

  -- Service options (JSONB - {online_appointments: true, in_person_visits: true})
  ADD COLUMN IF NOT EXISTS service_options JSONB,

  -- Accessibility
  ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN,

  -- Amenities (JSONB - {outdoor_play: true, grooming: true, webcams: true, etc.})
  ADD COLUMN IF NOT EXISTS amenities JSONB,

  -- Photos (JSONB array - ["url1", "url2", ...])
  ADD COLUMN IF NOT EXISTS photos JSONB,

  -- Business types array (daycare, boarding, grooming, training, etc.)
  ADD COLUMN IF NOT EXISTS business_types TEXT[],

  -- Timestamp when data was last scraped
  ADD COLUMN IF NOT EXISTS scraped_at TIMESTAMP;

-- Create index on place_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_dog_daycares_place_id ON dog_daycares(place_id);

-- Create index on coordinates for geographic queries
CREATE INDEX IF NOT EXISTS idx_dog_daycares_coordinates ON dog_daycares(latitude, longitude);

-- Create index on business_status
CREATE INDEX IF NOT EXISTS idx_dog_daycares_status ON dog_daycares(business_status);

-- Create index on business_types for filtering
CREATE INDEX IF NOT EXISTS idx_dog_daycares_business_types ON dog_daycares USING GIN(business_types);
