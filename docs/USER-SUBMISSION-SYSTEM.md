# User Submission System

## Overview
The User Submission System allows anyone to add missing dog daycare businesses to WoofSpots. All submissions go through admin review before going live.

## How It Works

### 1. Data Sources
Every business in our database has a `data_source` field:
- **scraped**: Automatically collected from Google Maps (bulk of data)
- **user_submitted**: Added by users, pending or approved
- **user_claimed**: Business owner claimed their listing
- **manual**: Manually added by admin

### 2. Verification Status
Each business has a `verification_status`:
- **unverified**: Scraped data, not yet verified
- **pending**: User submitted, awaiting admin review
- **verified**: Admin approved
- **rejected**: Admin rejected (with reason)

## User Flow

### Submitting a Business

**Endpoint:** `POST /api/submit-business`

**Request:**
```json
{
  "name": "Paws Paradise Dog Daycare",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zipCode": "94102",
  "phone": "(415) 555-1234",
  "website": "https://pawsparadise.com",
  "submitterName": "John Doe",
  "submitterEmail": "john@example.com"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Thank you! Your submission has been received and will be reviewed shortly.",
  "businessId": 12345
}
```

**Error Response (Duplicate):**
```json
{
  "error": "Business already exists",
  "message": "Paws Paradise Dog Daycare in San Francisco is already in our database.",
  "businessId": 9876
}
```

### What Happens Next

1. **Instant confirmation**: User gets success message
2. **Email confirmation**: Submitter receives email (TODO)
3. **Admin notification**: Admin gets notified of new submission (TODO)
4. **Review queue**: Submission appears in admin dashboard
5. **Approval/Rejection**: Admin reviews and decides
6. **Email notification**: Submitter gets approval or rejection email (TODO)

## Admin Flow

### View Pending Submissions

**Endpoint:** `GET /api/submit-business?status=pending&limit=50`

**Response:**
```json
{
  "submissions": [
    {
      "id": 12345,
      "name": "Paws Paradise Dog Daycare",
      "city": "San Francisco",
      "state": "CA",
      "address": "123 Main St",
      "phone": "(415) 555-1234",
      "website": "https://pawsparadise.com",
      "submitted_by_name": "John Doe",
      "submitted_by_email": "john@example.com",
      "submitted_at": "2025-10-24T19:30:00Z",
      "verification_status": "pending",
      "hours_pending": 2.5
    }
  ],
  "total": 15
}
```

### Approve a Submission

**Endpoint:** `POST /api/admin/review-submission`

**Request:**
```json
{
  "submissionId": 12345,
  "action": "approve",
  "adminEmail": "admin@woofspots.com",
  "notes": "Verified via phone call"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Business approved and is now live"
}
```

### Reject a Submission

**Request:**
```json
{
  "submissionId": 12345,
  "action": "reject",
  "adminEmail": "admin@woofspots.com",
  "notes": "Business closed permanently, confirmed via website"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Submission rejected"
}
```

### View Submission Stats

**Endpoint:** `GET /api/admin/review-submission`

**Response:**
```json
{
  "stats": [
    {
      "data_source": "scraped",
      "verification_status": "unverified",
      "count": 1247,
      "count_last_7_days": 89,
      "count_last_30_days": 247
    },
    {
      "data_source": "user_submitted",
      "verification_status": "pending",
      "count": 15,
      "count_last_7_days": 15,
      "count_last_30_days": 15
    },
    {
      "data_source": "user_submitted",
      "verification_status": "verified",
      "count": 42,
      "count_last_7_days": 8,
      "count_last_30_days": 28
    }
  ],
  "pending": [/* Array of pending submissions */],
  "totalPending": 15
}
```

## Database Functions

### Submit Business (Called by API)
```sql
SELECT submit_business(
  'Paws Paradise Dog Daycare',
  '123 Main St',
  'San Francisco',
  'CA',
  '94102',
  '(415) 555-1234',
  'https://pawsparadise.com',
  'John Doe',
  'john@example.com'
) as business_id;
```

### Approve Submission
```sql
SELECT approve_submission(
  12345,                          -- submission_id
  'admin@woofspots.com',          -- admin_email
  'Verified via phone call'       -- notes
);
```

### Reject Submission
```sql
SELECT reject_submission(
  12345,                          -- submission_id
  'admin@woofspots.com',          -- admin_email
  'Business closed permanently'   -- reason
);
```

## Database Views

### Pending Submissions Dashboard
```sql
SELECT * FROM pending_submissions
ORDER BY submitted_at ASC
LIMIT 50;
```

Returns all pending submissions with:
- Business details
- Submitter info
- Time pending (in hours)

### Recently Approved Submissions
```sql
SELECT * FROM recently_approved_submissions
LIMIT 20;
```

Returns submissions approved in last 7 days.

### Submission Stats
```sql
SELECT * FROM submission_stats;
```

Returns counts by data source and verification status.

## Frontend Integration

### Submission Form Component (TODO)
Create a React form component:
- Located at: `/app/submit-business/page.tsx`
- Form fields: name, address, city, state, ZIP, phone, website, your name, your email
- Client-side validation with Zod
- Toast notifications for success/error
- Link from search pages: "Don't see your daycare? Add it here"

### Admin Dashboard (TODO)
Create admin review interface:
- Located at: `/app/admin/submissions/page.tsx`
- Table of pending submissions
- Quick approve/reject buttons
- View submission details
- Add admin notes
- Stats overview

## Email Templates (TODO)

### Submission Confirmation
**To:** Submitter
**Subject:** Thanks for submitting {Business Name}!

```
Hi {Submitter Name},

Thank you for submitting {Business Name} to WoofSpots!

We've received your submission and our team will review it shortly. We typically review submissions within 24-48 hours.

You'll receive an email once we've completed the review.

Thanks for helping us build the most comprehensive dog daycare directory!

- The WoofSpots Team
```

### Approval Notification
**To:** Submitter
**Subject:** {Business Name} is now live on WoofSpots!

```
Hi {Submitter Name},

Great news! {Business Name} has been approved and is now live on WoofSpots.

View the listing: https://woofspots.com/listing/{business-id}

If this is your business, you can claim it to unlock premium features like photo uploads, detailed descriptions, and Top Dog placement.

Claim your business: https://woofspots.com/claim/{business-id}

Thanks for contributing to WoofSpots!

- The WoofSpots Team
```

### Rejection Notification
**To:** Submitter
**Subject:** Update on your WoofSpots submission

```
Hi {Submitter Name},

Thank you for submitting {Business Name} to WoofSpots.

After review, we're unable to add this business to our directory at this time.

Reason: {rejection_reason}

If you believe this was a mistake, please reply to this email and we'll take another look.

- The WoofSpots Team
```

## Benefits

1. **Comprehensive Coverage**: Users help us find boutique daycares we missed
2. **Community Trust**: Shows we're open to user contributions
3. **Lead Generation**: Submitters are potential business owners → upsell to "claimed" tier
4. **Quality Control**: Admin review prevents spam/fake listings
5. **SEO Boost**: More comprehensive listings = better search rankings

## Future Enhancements

1. **Auto-verification**: Use Google Places API to verify business exists
2. **Duplicate detection**: ML model to catch near-duplicate submissions
3. **Batch approval**: Admin can approve multiple submissions at once
4. **User reputation**: Track successful submissions, reward contributors
5. **Business owner verification**: Send verification code to business phone/email
6. **Photo uploads**: Allow submitters to include photos
7. **Amenities**: Let submitters add facility details (outdoor play, webcams, etc.)

## Migration

Run the migration to add submission fields:
```bash
psql $DATABASE_URL -f migrations/add-user-submission-fields.sql
```

This adds:
- `data_source` column
- `verification_status` column
- Submission tracking columns
- Review tracking columns
- Database functions for approve/reject
- Views for admin dashboard
