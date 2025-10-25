# Running the Tier System Migration

## Quick Start

**Option 1: Using Vercel CLI (Recommended)**

If you have Vercel CLI installed and your database is on Vercel:

```bash
# Pull environment variables from Vercel
vercel env pull .env.local

# Run the migration
node scripts/run-tier-migration.js
```

---

**Option 2: Manual DATABASE_URL**

If you know your DATABASE_URL:

```bash
# Set the DATABASE_URL temporarily
export DATABASE_URL="your_postgres_connection_string"

# Run the migration
node scripts/run-tier-migration.js
```

---

**Option 3: Create .env.local file**

Create a `.env.local` file in the project root:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database
```

Then update the migration script to load it:

```bash
# Install dotenv if needed
npm install dotenv

# Run with dotenv
node -r dotenv/config scripts/run-tier-migration.js
```

---

**Option 4: Direct SQL (if you have psql)**

```bash
psql $DATABASE_URL < migrations/add-tier-system.sql
```

---

## What the Migration Does

✅ Creates `listing_tier` enum type with values: 'unclaimed', 'claimed', 'top_dog'
✅ Adds `tier` column to `dog_daycares` (defaults to 'unclaimed')
✅ Adds Stripe integration columns (stripe_customer_id, stripe_subscription_id, etc.)
✅ Adds claim tracking (claimed_at, claimed_by_email, claimed_by_name)
✅ Adds Top Dog tracking (top_dog_since, top_dog_until)
✅ Creates helper functions:
  - `claim_listing(daycare_id, email, name)`
  - `upgrade_to_top_dog(daycare_id, customer_id, subscription_id, is_annual)`
  - `downgrade_from_top_dog(daycare_id)`
  - `is_top_dog_active(daycare_id)`
✅ Creates view: `top_dog_listings_summary`
✅ Creates indexes for performance

---

## After Migration

The script will show:
- ✅ Confirmation of each step
- 📊 Current tier distribution
- ✅ Verification that functions/views were created

All existing listings will automatically be set to tier 'unclaimed'.

---

## Troubleshooting

**"Connection refused" error:**
- Make sure DATABASE_URL is set correctly
- Check that your database is accessible from your machine
- If using Vercel Postgres, you may need to allowlist your IP

**"Already exists" warnings:**
- This is normal if you've run the migration before
- The script will skip already-created objects

**Need to rollback?**
- The migration uses `IF NOT EXISTS` so it's safe to re-run
- To manually rollback, you'd need to DROP the tier column and enum type
