# Woof Houses Premium Listing Stripe Setup

## 💰 Premium Listing Pricing

**Monthly Plan**: $99/month (recurring subscription)
**Annual Plan**: $990/year (one-time payment, 17% discount = saves ~$198/year)

## 🔧 Stripe Dashboard Setup

### Step 1: Create Premium Products & Prices

1. Go to https://dashboard.stripe.com/test/products
2. Click "**+ Add product**"

#### Product 1: Premium Listing - Monthly
- **Name**: Woof Houses Premium Listing (Monthly)
- **Description**: Get featured placement, premium badge, full analytics, booking integration, and priority support
- **Pricing**:
  - Model: Recurring
  - Price: $99.00 USD
  - Billing period: Monthly
  - Payment type: Recurring
- Click **Save product**
- Copy the **Price ID** (starts with `price_`)
- Add to `.env.local`: `STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_XXX`

#### Product 2: Premium Listing - Annual
- **Name**: Woof Houses Premium Listing (Annual)
- **Description**: Same premium features, billed annually. Save 17% ($198/year)!
- **Pricing**:
  - Model: Standard pricing
  - Price: $990.00 USD
  - Billing period: One time
  - Payment type: One-time
- Click **Save product**
- Copy the **Price ID** (starts with `price_`)
- Add to `.env.local`: `STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_XXX`

### Step 2: Environment Variables

Your `/Users/myles/depotclear/apps/web/.env.local` should have:

```bash
# Stripe Keys (from https://dashboard.stripe.com/test/apikeys)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY

# Premium Listing Prices
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID
STRIPE_PREMIUM_ANNUAL_PRICE_ID=price_YOUR_ANNUAL_PRICE_ID

# Webhook Secret (from https://dashboard.stripe.com/test/webhooks)
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001  # or your production URL

# Database
DATABASE_URL=postgresql://YOUR_DATABASE_URL
```

### Step 3: Set Up Webhooks

Premium subscriptions require webhooks to handle renewals and cancellations:

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "**Add endpoint**"
3. **Endpoint URL**: `https://your-domain.com/api/webhook/stripe`
4. **Events to listen for**:
   - `checkout.session.completed` - Premium purchase complete
   - `customer.subscription.created` - Monthly subscription started
   - `customer.subscription.updated` - Subscription changed
   - `customer.subscription.deleted` - Monthly subscription cancelled
   - `invoice.paid` - Monthly renewal successful
   - `invoice.payment_failed` - Payment failed
5. Click **Add endpoint**
6. Copy **Signing secret** (starts with `whsec_`)
7. Add to `.env.local`: `STRIPE_WEBHOOK_SECRET=whsec_XXX`

## 🎯 Premium Features

When a business upgrades to premium, they get:

### Listing Enhancements
- ⭐ **Premium Badge** - "Featured" or "Premium" badge on listing
- 📌 **Priority Placement** - Appears at top of search results
- 📸 **Unlimited Photos** - Upload up to 20 high-res photos
- ✍️ **Full Description** - 1000+ character description
- 🎨 **Custom Branding** - Logo, colors, custom styling

### Features & Integration
- 📅 **Booking Integration** - Direct booking link/widget
- 🏆 **Amenities Showcase** - Highlight all amenities with icons
- 🎥 **Video Tour** - Embed YouTube/Vimeo tour video
- ⭐ **Review Highlights** - Pin best reviews to top
- 📞 **Click-to-Call** - Phone number prominently displayed

### Analytics & Insights
- 📊 **View Analytics** - See how many people view your listing
- 🖱️ **Click Tracking** - Track clicks to website, phone, directions
- 📈 **Conversion Metrics** - See booking/inquiry conversion rates
- 🗺️ **Competitor Insights** - Compare to similar daycares nearby

### Support & Promotion
- 🚀 **Social Media Features** - Auto-post to Instagram/Facebook
- 📧 **Email Support** - Priority email support
- 💬 **Contest Eligibility** - Eligible for "Pup of the Week" features
- 🎁 **Special Promotions** - Featured in monthly newsletters

## 💳 Test Payment Flow

Use these test cards:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Success (Visa) |
| 5555 5555 5555 4444 | Success (Mastercard) |
| 4000 0025 0000 3155 | Requires 3D Secure authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 0341 | Declined (card declined) |

## 🚀 Going Live

When ready for production:

1. **Toggle to Live Mode** in Stripe Dashboard (top-right)
2. **Get Live Keys**: https://dashboard.stripe.com/apikeys
3. **Create Live Prices**: Re-create products in live mode
4. **Update .env.local** with live keys (or set in Vercel environment variables)
5. **Create Live Webhook**: Point to production URL
6. **Test with real card** (use your own card, amounts are real!)

## 🔒 Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- Use environment variables in Vercel for production
- Webhook signatures prevent tampering
- Always verify payment on server before granting access

---

## 📋 Quick Checklist

- [ ] Create Monthly Premium product in Stripe ($99/month)
- [ ] Create Annual Premium product in Stripe ($990/year)
- [ ] Copy both Price IDs to .env.local
- [ ] Set up webhook endpoint
- [ ] Copy webhook secret to .env.local
- [ ] Restart dev server
- [ ] Test with 4242 4242 4242 4242 card
- [ ] Verify premium features activate after payment

---

**Current Status**: Stripe integration ready for premium listings! Just need to create products in Stripe Dashboard and add price IDs to environment variables.
