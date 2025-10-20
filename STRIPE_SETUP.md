# Stripe Setup Guide for DepotClear

## ✅ What You Have

- **Stripe Product ID**: `prod_TGxjOGaHJcCoD8`
- **Stripe Test Secret Key**: `sk_test_51SKPg8E4VhgqqnmR...` (in `.env.local`)

## 🔧 What You Need to Do

### Step 1: Get Your Publishable Key

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Add it to `/Users/myles/depotclear/apps/web/.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
```

### Step 2: Create a Price for Your Product

You have a product ID, but you need to create a **Price** for it:

1. Go to https://dashboard.stripe.com/test/products/prod_TGxjOGaHJcCoD8
2. Click "Add pricing"
3. Set up the price:
   - **Pricing model**: Standard pricing
   - **Price**: $29.00 USD
   - **Billing period**: One time
   - **Payment type**: One-time
4. Click "Save pricing"
5. Copy the **Price ID** (starts with `price_`)
6. Add it to `.env.local`:

```bash
STRIPE_PRICE_ID=price_YOUR_PRICE_ID_HERE
```

### Step 3: Test the Checkout

1. Restart your dev server:
   ```bash
   # Stop the current server (Ctrl+C if needed)
   cd /Users/myles/depotclear/apps/web
   npm run dev
   ```

2. Go to http://localhost:3001/checkout
3. Enter an email address
4. Click "Continue to Payment"
5. Use Stripe test card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., 12/25)
   - CVC: Any 3 digits (e.g., 123)
   - ZIP: Any 5 digits (e.g., 12345)

### Step 4: Set Up Webhooks (Optional for Testing)

Webhooks let you know when payments succeed:

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `http://localhost:3001/api/webhook` (for local testing, use Stripe CLI)
4. Events to listen for:
   - `checkout.session.completed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
```

---

## 🔥 Quick Start (All Keys)

Your complete `.env.local` file should look like:

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
STRIPE_PRICE_ID=price_YOUR_PRICE_ID
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

---

## 🧪 Stripe Test Cards

Use these for testing:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0025 0000 3155 | Requires authentication |
| 4000 0000 0000 9995 | Declined (insufficient funds) |

---

## 📋 Checklist

- [ ] Get publishable key from Stripe Dashboard
- [ ] Create $29 one-time Price for product
- [ ] Add all keys to `.env.local`
- [ ] Restart dev server
- [ ] Test checkout with test card
- [ ] (Optional) Set up webhooks with Stripe CLI

---

## 🚀 Go Live

When you're ready to accept real payments:

1. Switch to **Live mode** in Stripe Dashboard (toggle in top-right)
2. Get your **live** keys:
   - `pk_live_...` (publishable)
   - `sk_live_...` (secret)
   - `price_...` (create live price)
3. Update `.env.local` with live keys
4. Set up webhook endpoint in production
5. Deploy to Vercel with environment variables

---

## 💡 Current Integration

We've built **Stripe Embedded Checkout** (just like your sample code):

✅ User enters email → Creates checkout session → Embedded payment form
✅ Payment completes → Redirects to `/success` page
✅ Success page verifies payment via API
✅ Ready to grant lifetime access

Your checkout flow:
1. `/checkout` - Collect email
2. API creates `clientSecret`
3. Stripe payment form embeds on page
4. Payment → `/success?session_id=xxx`
5. Verify payment → Show success message

---

## 🆘 Troubleshooting

### Error: "No such price"
- You need to create a Price for your product (see Step 2)

### Error: "Invalid API key"
- Check that `.env.local` has the correct keys
- Restart your dev server after changing env vars

### Checkout form doesn't appear
- Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check browser console for errors

### Webhook not receiving events
- Use Stripe CLI for local testing:
  ```bash
  stripe listen --forward-to localhost:3001/api/webhook
  ```

---

## 📖 Next Steps

Once payments work:

1. **Grant Access**: When webhook receives `checkout.session.completed`, save user to database with `has_lifetime_access = true`
2. **Send Email**: Use Resend or SendGrid to send welcome email with login link
3. **Authentication**: Add login system (NextAuth.js or Supabase Auth)
4. **Dashboard**: Build user dashboard to manage preferences and alerts

The payment system is ready - now you just need to connect it to your user management! 🎉
