# DepotClear Deployment Guide

Complete guide for deploying DepotClear as a one-time payment product.

## 🎯 Overview

This application monetizes through a **$29 one-time payment** via Stripe, granting lifetime access.

## 📋 Prerequisites

1. **Vercel Account** (for hosting)
2. **Supabase Account** (for PostgreSQL database)
3. **Stripe Account** (for payments)
4. **OpenAI API Key** (for AI insights)

---

## 1️⃣ Database Setup (Supabase)

### Step 1: Create Supabase Project
```bash
1. Go to https://supabase.com
2. Create new project
3. Copy your connection string
```

### Step 2: Run Schema
```bash
# In Supabase SQL Editor, run:
cat packages/database/schema.sql
```

### Step 3: Save Connection String
```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
```

---

## 2️⃣ Stripe Setup (One-Time Payment)

### Step 1: Create Product
```bash
1. Go to https://dashboard.stripe.com/products
2. Create new product:
   - Name: "DepotClear Lifetime Access"
   - Description: "One-time payment for lifetime access"
   - Pricing: $29 USD (one-time)
3. Copy the Price ID (price_xxxxx)
```

### Step 2: Configure Webhook
```bash
1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: https://your-domain.com/api/webhook
3. Events to listen for:
   - checkout.session.completed
   - charge.refunded
4. Copy webhook signing secret
```

### Step 3: Get API Keys
```
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PRICE_ID=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

---

## 3️⃣ Deploy to Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Initialize Project
```bash
cd depotclear
vercel init
```

### Step 3: Set Environment Variables
```bash
vercel env add DATABASE_URL
vercel env add STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PRICE_ID
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add OPENAI_API_KEY
vercel env add CRON_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

### Step 4: Deploy
```bash
# Deploy to production
vercel --prod

# Your app will be live at:
# https://depotclear.vercel.app
```

---

## 4️⃣ Enable Automated Scraping

Vercel automatically runs the cron job defined in `vercel.json`:

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

The scraper will run at:
- 12:00 AM
- 6:00 AM
- 12:00 PM
- 6:00 PM (UTC)

---

## 5️⃣ Custom Domain (Optional)

```bash
# Add custom domain
vercel domains add depotclear.com

# Configure DNS:
# Type: CNAME
# Name: @
# Value: cname.vercel-dns.com
```

---

## 6️⃣ Install Dependencies & Test Locally

```bash
# Install all dependencies
npm install

# Install Playwright browsers for scraper
cd packages/scraper
npx playwright install chromium

# Test scraper locally
npm run scraper

# Test web app locally
cd apps/web
npm run dev
# Visit http://localhost:3000
```

---

## 7️⃣ Payment Flow

### Customer Journey:
1. User visits landing page
2. Clicks "Get Lifetime Access - $29"
3. Enters email on checkout page
4. Redirected to Stripe Checkout
5. Completes payment
6. Webhook grants lifetime access in database
7. User receives welcome email with login

### Code Integration:
```typescript
// apps/web/app/api/checkout/route.ts
const session = await stripe.checkout.sessions.create({
  mode: 'payment', // One-time payment
  line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
});
```

---

## 8️⃣ Monitoring & Analytics

### Vercel Analytics
```bash
# Enable in Vercel dashboard
# Shows traffic, page views, bounce rate
```

### Stripe Dashboard
- Monitor revenue
- Track conversion rates
- Handle refunds (30-day guarantee)

### Database Monitoring
```sql
-- Total users with lifetime access
SELECT COUNT(*) FROM users WHERE has_lifetime_access = true;

-- Revenue calculation
SELECT COUNT(*) * 29 as total_revenue FROM users WHERE has_lifetime_access = true;

-- Active products
SELECT COUNT(*) FROM products WHERE scraped_at > NOW() - INTERVAL '24 hours';
```

---

## 9️⃣ Email Integration (Recommended)

Use **Resend** or **SendGrid** for transactional emails:

```bash
npm install resend

# apps/web/lib/email.ts
import { Resend } from 'resend';

export async function sendWelcomeEmail(email: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'DepotClear <hello@depotclear.com>',
    to: email,
    subject: 'Welcome to DepotClear! 🎉',
    html: `
      <h1>Thanks for your purchase!</h1>
      <p>You now have lifetime access to DepotClear.</p>
      <a href="https://depotclear.com/search">Start finding deals →</a>
    `,
  });
}
```

---

## 🔟 Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Enable Vercel deployment protection
- [ ] Verify Stripe webhooks with signature
- [ ] Rate limit API endpoints
- [ ] Use HTTPS only
- [ ] Implement CSRF protection
- [ ] Sanitize user inputs

---

## 💰 Pricing Strategy

**Initial Launch: $29 one-time**
- No monthly fees
- Lifetime updates
- 30-day money-back guarantee

**Future Options:**
- Early bird: $19 (first 100 customers)
- Launch week: $24 (limited time)
- Standard: $29 (regular price)
- Premium: $49 (with priority support)

---

## 📊 Success Metrics

Track these KPIs:
1. **Conversion Rate**: Visitors → Purchases
2. **Revenue**: Total sales × $29
3. **Refund Rate**: Should be < 5%
4. **Active Users**: Daily/weekly logins
5. **Scraper Health**: Items found per run

---

## 🚀 Launch Checklist

- [ ] Database schema deployed
- [ ] Scraper tested and working
- [ ] Frontend loads without errors
- [ ] Stripe test payment successful
- [ ] Webhook handling verified
- [ ] Custom domain configured
- [ ] Analytics enabled
- [ ] Email notifications working
- [ ] 30-day refund policy documented
- [ ] Privacy policy & ToS published

---

## 🆘 Troubleshooting

### Scraper Not Finding Items
```bash
# Test manually
cd packages/scraper
node src/index.js

# Check logs
vercel logs
```

### Stripe Webhook Not Firing
```bash
# Test locally with Stripe CLI
stripe listen --forward-to localhost:3000/api/webhook
stripe trigger checkout.session.completed
```

### Database Connection Issues
```bash
# Test connection
psql $DATABASE_URL

# Check Supabase dashboard for errors
```

---

## 📞 Support

- **GitHub Issues**: https://github.com/yourname/depotclear/issues
- **Email**: support@depotclear.com
- **Stripe Support**: https://support.stripe.com

---

## 🎉 Ready to Launch!

Your one-time payment SaaS is ready. Deploy with:

```bash
vercel --prod
```

Good luck with DepotClear! 🏪✨
