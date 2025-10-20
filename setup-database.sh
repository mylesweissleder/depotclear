#!/bin/bash

# DepotClear Database Setup Script
# Run this to initialize your Neon PostgreSQL database

echo "🗄️  Setting up DepotClear database..."
echo ""

# Check if psql is installed
if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client (psql) not found!"
    echo ""
    echo "To install on macOS:"
    echo "  brew install postgresql"
    echo ""
    echo "OR use Neon's web SQL editor:"
    echo "  1. Go to: https://console.neon.tech"
    echo "  2. Select your project"
    echo "  3. Click 'SQL Editor'"
    echo "  4. Copy/paste the contents of packages/database/schema.sql"
    echo "  5. Click 'Run'"
    echo ""
    exit 1
fi

# Database connection string - UPDATE THIS with your Neon connection string
DB_URL="postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require"

# Or get it from .env.local:
# DB_URL=$(grep DATABASE_URL apps/web/.env.local | cut -d '=' -f2)

echo "Connecting to Neon database..."
echo ""

# Run the schema file
psql "$DB_URL" -f packages/database/schema.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database setup complete!"
    echo ""
    echo "Tables created:"
    echo "  - products"
    echo "  - store_availability"
    echo "  - users"
    echo "  - price_history"
    echo "  - ai_insights"
    echo ""
    echo "Verify with:"
    echo "  psql '$DB_URL' -c '\dt'"
    echo ""
else
    echo ""
    echo "❌ Database setup failed!"
    echo "Check the error messages above"
    echo ""
fi
