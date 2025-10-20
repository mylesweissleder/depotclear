# 🚀 Production Setup Guide - DepotClear

## ✅ What You Have

- **Vercel Project**: https://vercel.com/startuplive/depotclear
- **Neon Database**: `ep-snowy-water-ahobfnp3-pooler.c-3.us-east-1.aws.neon.tech`
- **Stripe Account**: Configured with test keys
- **GitHub Repo**: https://github.com/mylesweissleder/depotclear

---

## 📋 Step-by-Step Production Setup

### Step 1: Set Up Database

1. **Connect to your Neon database:**
   ```bash
   psql 'postgresql://neondb_owner:npg_fPL4max0wRvy@ep-snowy-water-ahobfnp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
   ```

2. **Run the schema:**
   ```bash
   # Copy the schema file
   cat packages/database/schema.sql

   # Then paste it into the psql prompt
   # Or run it directly:
   psql 'postgresql://...' < packages/database/schema.sql
   ```

3. **Verify tables were created:**
   ```sql
   \dt  -- List all tables
   -- You should see: products, store_availability, users, price_history, ai_insights
   ```

---

### Step 2: Configure Vercel Environment Variables

Go to: https://vercel.com/startuplive/depotclear/settings/environment-variables

Add these variables for **Production**:

#### Database
```
DATABASE_URL=postgresql://neondb_owner:npg_fPL4max0wRvy@ep-snowy-water-ahobfnp3-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### Stripe (Test Mode - for now)
```
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

STRIPE_PRICE_ID=price_YOUR_PRICE_ID
```

**Note**: Get these from your Stripe Dashboard → Developers → API Keys
Or from your `.env.local` file locally

#### App URL (update this with your Vercel URL)
```
NEXT_PUBLIC_APP_URL=https://depotclear.vercel.app
```
(Or use your custom domain if you have one)

#### Optional: For Cron Job Security
```
CRON_SECRET=your_random_secure_string_here
```

---

### Step 3: Redeploy

After adding environment variables:

1. Go to: https://vercel.com/startuplive/depotclear/deployments
2. Click on the latest deployment
3. Click "Redeploy" → Select "Use existing Build Cache" → Deploy

OR simply push a new commit:
```bash
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

Vercel will automatically deploy.

---

### Step 4: Test Production Deployment

1. **Visit your site:**
   - Go to your Vercel URL (e.g., https://depotclear.vercel.app)

2. **Test the checkout:**
   - Go to `/checkout`
   - Enter email
   - Use test card: `4242 4242 4242 4242`
   - Complete payment
   - Should redirect to `/success`

3. **Check database:**
   ```sql
   -- In psql, check if products are being fetched
   SELECT COUNT(*) FROM products;
   ```

---

### Step 5: Set Up Stripe Webhook (Production)

1. **Go to Stripe Webhooks:**
   https://dashboard.stripe.com/test/webhooks

2. **Add endpoint:**
   - URL: `https://depotclear.vercel.app/api/webhook`
   - Events to listen for:
     - `checkout.session.completed`
     - `charge.refunded`

3. **Get signing secret:**
   - Copy the webhook signing secret (starts with `whsec_`)

4. **Add to Vercel:**
   - Go to environment variables
   - Add: `STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET`

5. **Redeploy**

---

### Step 6: Enable Vercel Cron Jobs

Your `vercel.json` already has cron configured:

```json
{
  "crons": [
    {
      "path": "/api/cron/scrape",
      "schedule": "0 */6 * * *"  // Every 6 hours
    }
  ]
}
```

Vercel will automatically run this in production!

To secure it:
1. Add `CRON_SECRET` env var
2. Cron job checks this secret before running

---

### Step 7: Custom Domain (Optional)

1. **Buy domain** (e.g., depotclear.com from Namecheap)

2. **Add to Vercel:**
   - Go to: https://vercel.com/startuplive/depotclear/settings/domains
   - Click "Add Domain"
   - Enter: depotclear.com
   - Follow DNS setup instructions

3. **Update env vars:**
   ```
   NEXT_PUBLIC_APP_URL=https://depotclear.com
   ```

4. **Update Stripe webhook URL** to use custom domain

---

## 🔄 Going Live with Real Payments

### When Ready for Real Money:

1. **Switch Stripe to Live Mode:**
   - Toggle in Stripe Dashboard (top right)
   - Get LIVE keys:
     - `pk_live_...` (publishable)
     - `sk_live_...` (secret)

2. **Create Live Price:**
   - Products → DepotClear Lifetime Access
   - Add pricing → $29 one-time
   - Copy new `price_live_...` ID

3. **Update Vercel Env Vars:**
   - Replace all `sk_test_` with `sk_live_`
   - Replace all `pk_test_` with `pk_live_`
   - Replace `price_test_` with `price_live_`

4. **Redeploy**

5. **Test with Real Card** (then refund immediately):
   - Use your own card
   - Complete checkout
   - Go to Stripe Dashboard → Payments
   - Refund the test payment

---

## 🧪 Quick Test Checklist

Before going live:

- [ ] Database connection works
- [ ] Homepage loads correctly
- [ ] Search page shows products
- [ ] Checkout flow completes
- [ ] Payment goes through (test mode)
- [ ] Success page shows confirmation
- [ ] Webhook receives events
- [ ] Cron job can be triggered manually

---

## 🚨 Common Issues & Fixes

### Build fails on Vercel
**Problem**: Missing dependencies or build errors
**Fix**: Check Vercel build logs, ensure all packages are in `package.json`

### Database connection fails
**Problem**: `DATABASE_URL` not set or incorrect
**Fix**: Verify connection string in Vercel env vars

### Checkout doesn't load
**Problem**: Missing Stripe publishable key
**Fix**: Ensure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set (must start with `NEXT_PUBLIC_`)

### Webhook not receiving events
**Problem**: Wrong URL or secret
**Fix**:
1. Check webhook URL is `https://YOUR_DOMAIN/api/webhook`
2. Verify `STRIPE_WEBHOOK_SECRET` is correct
3. Test with Stripe CLI:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Environment variables not working
**Problem**: Need to redeploy after changing env vars
**Fix**: Always redeploy after adding/changing environment variables

---

## 📊 Monitoring Your Production App

### Vercel Analytics
- Go to: https://vercel.com/startuplive/depotclear/analytics
- See traffic, page views, performance

### Vercel Logs
- Go to: https://vercel.com/startuplive/depotclear/logs
- See real-time logs, errors, API calls

### Stripe Dashboard
- Go to: https://dashboard.stripe.com
- Monitor payments, refunds, revenue

### Database
```sql
-- Check total users
SELECT COUNT(*) FROM users WHERE has_lifetime_access = true;

-- Check total revenue
SELECT COUNT(*) * 29 AS total_revenue FROM users WHERE has_lifetime_access = true;

-- Check recent products
SELECT * FROM products ORDER BY scraped_at DESC LIMIT 10;

-- Check penny deals
SELECT * FROM products WHERE price <= 1.00 ORDER BY price ASC LIMIT 20;
```

---

## 🎯 Post-Launch Tasks

### Week 1: Monitoring
- [ ] Check error logs daily
- [ ] Monitor payment success rate
- [ ] Track conversion rate
- [ ] Respond to support emails

### Week 2: Marketing
- [ ] Post on Product Hunt
- [ ] Share on Reddit (r/Frugal, r/HomeDepot)
- [ ] Email personal network
- [ ] Create social media accounts

### Week 3: Optimization
- [ ] A/B test pricing ($24 vs $29)
- [ ] Improve SEO (meta tags, sitemap)
- [ ] Add Google Analytics
- [ ] Set up customer feedback

### Week 4: Features
- [ ] Email alerts for penny deals
- [ ] User dashboard
- [ ] Favorite stores
- [ ] Price drop notifications

---

## 💰 Scaling Plan

### At 100 Customers ($2,900 revenue)
- Celebrate! 🎉
- Add more categories
- Improve scraper speed

### At 500 Customers ($14,500 revenue)
- Hire VA for support
- Add Lowe's integration
- Create mobile app

### At 1,000 Customers ($29,000 revenue)
- Scale infrastructure
- Add premium tier ($99)
- Launch affiliate program

### At 5,000+ Customers ($145,000+ revenue)
- Full-time business!
- Hire developer
- Expand to all retailers

---

## ✅ You're Ready!

Your production environment is set up:
- ✅ Vercel hosting configured
- ✅ Neon database ready
- ✅ Stripe payments integrated
- ✅ Cron jobs scheduled

Just:
1. Add environment variables to Vercel
2. Run database schema
3. Redeploy
4. Test checkout
5. **LAUNCH!** 🚀

---

**Need help?** Check the logs:
- Vercel: https://vercel.com/startuplive/depotclear/logs
- Database: `psql 'postgresql://...'`
- Stripe: https://dashboard.stripe.com/test/events

Good luck! 🍀
