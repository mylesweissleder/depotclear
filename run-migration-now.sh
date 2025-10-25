#!/bin/bash

# Neon database connection string
export DATABASE_URL="postgresql://neondb_owner:npg_fPL4max0wRvy@ep-snowy-water-ahobfnp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

echo "🚀 Running tier system migration..."
echo ""

node scripts/run-tier-migration.js
