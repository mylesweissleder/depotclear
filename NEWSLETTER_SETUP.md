# Newsletter System Setup Guide

## Overview

Complete newsletter system for Woof Houses featuring:
- **Monthly newsletters** with contest entries, winners, and featured daycares
- **Auto opt-in** when users vote or submit contest photos
- **React Email** templates for beautiful, responsive emails
- **Resend** for reliable email delivery
- **Admin interface** for composing and sending newsletters
- **Unsubscribe** functionality

---

## Files Created

### Email Templates
- `apps/web/emails/MonthlyNewsletter.tsx` - Main newsletter template

### Admin Interface
- `apps/web/app/admin/newsletter/page.tsx` - Newsletter composition and sending UI

### API Routes
- `apps/web/app/api/newsletter/preview/route.ts` - Preview newsletter HTML
- `apps/web/app/api/newsletter/send-test/route.ts` - Send test email
- `apps/web/app/api/newsletter/send/route.ts` - Send to all subscribers
- `apps/web/app/api/newsletter/subscribers/count/route.ts` - Get subscriber count
- `apps/web/app/api/newsletter/unsubscribe/route.ts` - Handle unsubscribes

### User Pages
- `apps/web/app/newsletter/unsubscribe/page.tsx` - Unsubscribe confirmation page

### Database
- `packages/scraper/migrations/create-newsletter-table.sql` - Newsletter subscribers table

### Utilities
- `apps/web/lib/email-utils.ts` - Email normalization (prevents Gmail + tricks)

---

## Setup Instructions

### 1. Install Dependencies

Already installed:
```bash
npm install @react-email/components resend
```

### 2. Run Database Migration

```bash
# Apply the newsletter subscribers table migration
psql $DATABASE_URL -f packages/scraper/migrations/create-newsletter-table.sql
```

### 3. Set Up Resend Account

1. Go to [resend.com](https://resend.com) and create an account
2. Verify your sending domain (e.g., `woofhouses.com`)
3. Get your API key from the dashboard
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://woofhouses.com
```

### 4. Configure Sending Domain

In Resend dashboard:
- Add domain: `woofhouses.com`
- Add DNS records (SPF, DKIM, DMARC)
- Verify domain
- Set "From" address: `newsletter@woofhouses.com`

---

## How It Works

### Auto Opt-In

When users interact with contests, they're automatically subscribed:

**Voting** (`/api/contest/vote/route.ts`):
```typescript
await sql`
  INSERT INTO newsletter_subscribers
  (email, normalized_email, source, ...)
  VALUES (${voterEmail}, ${normalizedEmail}, 'contest_vote', ...)
  ON CONFLICT (email) DO NOTHING
`;
```

**Submitting** (`/api/contest/submit/route.ts`):
```typescript
await sql`
  INSERT INTO newsletter_subscribers
  (email, normalized_email, source, ...)
  VALUES (${ownerEmail}, ${normalizedEmail}, 'contest_submission', ...)
  ON CONFLICT (email) DO NOTHING
`;
```

### Email Normalization

Prevents vote manipulation with Gmail + tricks:
- `user+1@gmail.com` → `user@gmail.com`
- `u.s.e.r@gmail.com` → `user@gmail.com`
- Works for Gmail, Outlook, Yahoo, ProtonMail, etc.

### Newsletter Content

Monthly newsletters feature:

1. **Contest Winners** - Top 3 vote-getters with photos
2. **Featured Entries** - 6 funny/popular contest photos
3. **Featured Daycares** - 3 top-rated premium listings
4. **Custom Message** - Optional announcement from admin

---

## Usage

### Access Admin Panel

Navigate to:
```
http://localhost:3000/admin/newsletter
```

### Compose Newsletter

1. **Set Month**: e.g., "November 2025"
2. **Add Custom Message** (optional): Announcements, updates, etc.
3. **Review Auto-Selected Content**:
   - Top 3 contest entries auto-selected as winners
   - Next 6 entries auto-selected as featured
   - Top 3 daycares (4.5+ stars with websites) auto-selected

### Preview

Click **Preview Newsletter** to open rendered HTML in new tab.

### Send Test

1. Enter your email address
2. Click **Send Test Email**
3. Check inbox for test newsletter

### Send to All Subscribers

1. Review all content carefully
2. Send test first!
3. Click **Send Newsletter**
4. Confirm (sends to all subscribed users)

---

## Sending Logic

### Batch Sending

Resend API allows batch sending (100 emails per batch):

```typescript
await resend.batch.send(
  subscribers.map(sub => ({
    from: 'Woof Houses <newsletter@woofhouses.com>',
    to: [sub.email],
    subject: `Woof Houses Monthly - ${month} 🐕`,
    react: MonthlyNewsletter({ ... }),
  }))
);
```

### Rate Limiting

1-second delay between batches to avoid rate limits.

### Unsubscribe Tokens

Each email includes unsubscribe link with normalized email as token:
```
https://woofhouses.com/newsletter/unsubscribe?token={normalizedEmail}
```

---

## Database Schema

### `newsletter_subscribers` Table

```sql
CREATE TABLE newsletter_subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  normalized_email TEXT NOT NULL,
  source TEXT DEFAULT 'contest_vote', -- Where they signed up

  -- Status
  subscribed BOOLEAN DEFAULT TRUE,
  confirmed BOOLEAN DEFAULT FALSE,

  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,

  -- Timestamps
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Indexes

- `normalized_email` - Fast duplicate detection
- `subscribed = TRUE` - Quick subscriber queries
- `source` - Track acquisition channels

---

## Monitoring

### View Subscriber Count

```sql
SELECT COUNT(*) FROM newsletter_subscribers WHERE subscribed = TRUE;
```

### View by Source

```sql
SELECT
  source,
  COUNT(*) as count,
  COUNT(*) FILTER (WHERE subscribed = TRUE) as active
FROM newsletter_subscribers
GROUP BY source;
```

### View Recent Signups

```sql
SELECT email, source, subscribed_at
FROM newsletter_subscribers
WHERE subscribed = TRUE
ORDER BY subscribed_at DESC
LIMIT 100;
```

---

## Best Practices

### Before Sending

- ✅ **Send test email first** - Always test before sending to all
- ✅ **Preview in multiple email clients** - Gmail, Outlook, Apple Mail
- ✅ **Check all links** - Contest page, unsubscribe, featured daycares
- ✅ **Verify images** - Contest photos, daycare logos
- ✅ **Proofread** - Custom message, winner names, daycare info

### Content Guidelines

- **Winners**: Top 3 vote-getters from current month
- **Featured Entries**: 4-9 highest vote-getters (fun variety)
- **Featured Daycares**: Top-rated with websites (premium/verified preferred)
- **Custom Message**: Keep under 2-3 sentences

### Sending Schedule

Recommended: **First Monday of each month**
- Allows weekend for final votes
- Monday morning inbox presence
- Consistent reader expectations

---

## Troubleshooting

### Emails Not Sending

1. Check Resend API key in `.env.local`
2. Verify domain in Resend dashboard
3. Check DNS records (SPF, DKIM, DMARC)
4. Review Resend logs for errors

### Preview Not Loading

1. Check database connection
2. Verify contest entries exist
3. Check console for errors
4. Try with minimal content first

### Unsubscribe Not Working

1. Verify `normalized_email` exists in database
2. Check unsubscribe API route logs
3. Test with known subscriber email

---

## Future Enhancements

### Phase 1 (Current)
- ✅ Auto opt-in on contest participation
- ✅ Monthly newsletter composition
- ✅ Contest winners showcase
- ✅ Featured daycares
- ✅ Unsubscribe functionality

### Phase 2 (Planned)
- 📧 Double opt-in confirmation emails
- 📊 Open/click tracking
- 🎯 Segmentation (contest voters vs. submitters)
- 📅 Scheduled sending (cron job)
- 🖼️ Newsletter archive on website

### Phase 3 (Future)
- 💬 Personalized content (based on city, preferences)
- 🔔 Real-time contest updates
- 🏆 Winner notification emails
- 🎉 Welcome sequence for new subscribers
- 📈 Analytics dashboard

---

## Support

For issues or questions:
1. Check logs in Vercel dashboard
2. Review Resend dashboard for delivery status
3. Test with small subscriber subset first
4. Monitor database for subscriber growth

---

**Last Updated**: October 2025
**Version**: 1.0
