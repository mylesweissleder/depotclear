# Resend Email DNS Setup for woofspots.com

## Overview
To send emails from `woofspots.com` using Resend, you need to add specific DNS records to your domain in Hover.com.

## Current Status
✅ MX record for sending is already added and verified
⚠️ Missing: Domain verification TXT record

---

## DNS Records to Add in Hover.com

### 1. Domain Verification Record (REQUIRED)

**Type:** TXT
**Name/Host:** `resend._domainkey`
**Content/Value:** `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgKBgqCKXnAQB2Khy...` (full value from Resend dashboard)
**TTL:** Auto (or 15 minutes)

> **Note:** Copy the EXACT full value from your Resend dashboard. It starts with `p=MIGfMA0G...` and is very long.

### 2. SPF (Sender Policy Framework) Record

**Type:** TXT
**Name/Host:** `send`
**Content/Value:** `v=spf1 include:amazonses.com ~all`
**TTL:** Auto (or 15 minutes)

### 3. DMARC (Email Authentication) Record

**Type:** TXT
**Name/Host:** `_dmarc`
**Content/Value:** `v=DMARC1; p=none;`
**TTL:** Auto (or 15 minutes)

> **Important:** You currently have TWO `_dmarc` records in Hover. Delete the duplicate and keep only one with the value above.

### 4. MX Record (Already Added ✓)

**Type:** MX
**Name/Host:** `send`
**Content/Value:** `feedback-smtp.us-east-1.amazonses.com`
**Priority:** 10
**TTL:** Auto

---

## Step-by-Step Instructions

### In Hover.com DNS Panel:

1. **Go to DNS settings:**
   - Navigate to https://www.hover.com/control_panel/domain/woofspots.com/dns
   - Click on the "DNS" tab

2. **Delete duplicate DMARC record:**
   - Find the duplicate `_dmarc` TXT records (you have 2)
   - Delete one of them (keep the one with just `v=DMARC1; p=none;`)
   - Click the X button to remove it

3. **Verify existing records:**
   Check that you have these records already (if missing, add them):

   ```
   ✓ TXT    send              v=spf1 include:amazonses.com ~all
   ✓ TXT    _dmarc            v=DMARC1; p=none;
   ✓ MX     send              feedback-smtp.us-east-1.amazonses.com (Priority: 10)
   ```

4. **Add the Domain Verification record:**
   - Click "ADD A RECORD" button
   - Select type: **TXT**
   - Hostname: `resend._domainkey`
   - Value: Paste the FULL value from Resend dashboard (starts with `p=MIGfMA0G...`)
   - Click "SAVE"

5. **Wait for DNS propagation:**
   - DNS changes can take 15 minutes to 48 hours to propagate
   - Usually it's much faster (15-30 minutes)

---

## Verification in Resend

After adding all DNS records:

1. Go to your Resend dashboard: https://resend.com/domains
2. Select your `woofspots.com` domain
3. Click the **"I've added the records"** button
4. Wait for verification (usually instant if DNS has propagated)
5. You should see a green checkmark ✓ when verified

---

## Testing Email Sending

Once your domain is verified, you can test sending emails:

### Option 1: Use the Admin Panel
1. Go to `http://localhost:3001/admin/newsletter`
2. Click "Send Test Email"
3. Enter your email address
4. Check your inbox

### Option 2: Test via API
```bash
curl -X POST http://localhost:3001/api/newsletter/send-test \
  -H "Content-Type: application/json" \
  -d '{"email": "your@email.com"}'
```

---

## Troubleshooting

### "Domain not verified" error:
- **Cause:** DNS records not propagated yet
- **Solution:** Wait 15-30 minutes and try again

### "SPF validation failed":
- **Cause:** Missing or incorrect SPF record
- **Solution:** Verify the `send` TXT record contains exactly: `v=spf1 include:amazonses.com ~all`

### "DKIM validation failed":
- **Cause:** Missing or incorrect domain key
- **Solution:** Double-check the `resend._domainkey` TXT record value is copied exactly from Resend

### Check DNS propagation:
Use these tools to verify your DNS records are live:
- https://dnschecker.org/
- https://mxtoolbox.com/SuperTool.aspx

---

## Current DNS Records Summary

Based on your Hover screenshot, here's what you currently have:

| Type   | Host               | Value                                          | Status |
|--------|-------------------|------------------------------------------------|--------|
| TXT    | @                 | v=spf1 include:_spf.resend.com ~all           | ✓      |
| A      | @                 | 216.150.1.1                                    | ✓      |
| MX     | @                 | 10.mx.hover.com.cust.hostedemail.com          | ✓      |
| TXT    | _dmarc            | v=DMARC1; p=none;rua=mailto:dmarc@woofspots.com | ⚠️ Duplicate |
| TXT    | _dmarc            | v=DMARC1; p=none;                             | ⚠️ Duplicate |
| TXT    | resend._domainkey | p=MIGfMA0GCSqGSIb3DQEB...                     | ✓      |
| TXT    | send              | v=spf1 include:amazonses.com ~all             | ✓      |
| CNAME  | www               | 8faca10f42c01e80.vercel-dns-016.com          | ✓      |

**Action needed:** Delete ONE of the duplicate `_dmarc` records.

---

## Email Configuration in Code

The Resend API key is already configured in your `.env.local`:

```bash
RESEND_API_KEY=re_NipRVeYo_3jK4Te1WHSsznCMEnJpJz9Cf
```

**Important:** Make sure to add this to your Vercel production environment variables as well:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add `RESEND_API_KEY` with the value above
3. Redeploy your application

---

## Email Addresses You Can Use

Once verified, you can send emails from any address `@woofspots.com`:
- `noreply@woofspots.com` - Automated emails, newsletters
- `contest@woofspots.com` - Contest notifications
- `support@woofspots.com` - Support emails
- `hello@woofspots.com` - General communications

Configure the "from" address in your email sending code as needed.
