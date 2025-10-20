-- DepotClear Database Schema

-- Products table: stores all scraped clearance items
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  price_text VARCHAR(50),
  category VARCHAR(100),
  model_number VARCHAR(100),
  url TEXT,
  image_url TEXT,
  is_clearance_price BOOLEAN DEFAULT false,
  scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Search optimization
  tsv_title tsvector GENERATED ALWAYS AS (to_tsvector('english', title)) STORED
);

-- Store availability table
CREATE TABLE IF NOT EXISTS store_availability (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(product_id) ON DELETE CASCADE,
  store_name VARCHAR(200) NOT NULL,
  store_id VARCHAR(50),
  zip_code VARCHAR(10),
  distance_miles DECIMAL(5, 2),
  in_stock BOOLEAN DEFAULT false,
  stock_status VARCHAR(50),
  last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(product_id, store_id)
);

-- Users table (for one-time purchase tracking)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  stripe_customer_id VARCHAR(100),
  stripe_payment_id VARCHAR(100),
  has_lifetime_access BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

-- Price history for trend analysis
CREATE TABLE IF NOT EXISTS price_history (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(50) REFERENCES products(product_id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI insights cache
CREATE TABLE IF NOT EXISTS ai_insights (
  id SERIAL PRIMARY KEY,
  insight_type VARCHAR(50) NOT NULL, -- 'category_trend', 'weekly_summary', etc.
  content TEXT NOT NULL,
  metadata JSONB,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_clearance ON products(is_clearance_price) WHERE is_clearance_price = true;
CREATE INDEX idx_products_scraped_at ON products(scraped_at DESC);
CREATE INDEX idx_products_tsv_title ON products USING GIN(tsv_title);

CREATE INDEX idx_store_availability_product ON store_availability(product_id);
CREATE INDEX idx_store_availability_zip ON store_availability(zip_code);
CREATE INDEX idx_store_availability_stock ON store_availability(in_stock) WHERE in_stock = true;

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_lifetime ON users(has_lifetime_access) WHERE has_lifetime_access = true;

CREATE INDEX idx_price_history_product ON price_history(product_id, recorded_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for products table
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- View for quick clearance queries
CREATE OR REPLACE VIEW clearance_deals AS
SELECT
  p.*,
  COALESCE(s.in_stock, false) as has_stock,
  s.store_name,
  s.zip_code,
  s.distance_miles,
  ROUND(((p.original_price - p.price) / NULLIF(p.original_price, 0)) * 100) as discount_percent
FROM products p
LEFT JOIN store_availability s ON p.product_id = s.product_id
WHERE p.is_clearance_price = true
ORDER BY p.price ASC, p.scraped_at DESC;
