# Admin Tools Authentication Setup

## Overview

The admin tools (Newsletter Admin and Social Media Manager) are protected by password authentication. Users must log in to access these tools.

## Setup

### 1. Set Admin Password

Add the following environment variable to your `.env` or `.env.local` file:

```bash
ADMIN_PASSWORD=your_secure_password_here
```

**Security recommendations:**
- Use a strong password (at least 12 characters)
- Include uppercase, lowercase, numbers, and special characters
- Don't commit this password to version control
- Rotate the password periodically

### 2. Deploy

After setting the environment variable:

**Local development:**
```bash
# Restart your development server
npm run dev
```

**Production (Vercel):**
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add `ADMIN_PASSWORD` with your secure password
4. Redeploy your application

## Usage

### Accessing Admin Tools

1. **Newsletter Admin**: Navigate to `/admin/newsletter`
2. **Social Media Manager**: Navigate to `/admin/social`

Both routes will redirect to `/admin/login` if not authenticated.

### Login Process

1. Visit any protected admin route (e.g., `/admin/newsletter`)
2. You'll be redirected to `/admin/login`
3. Enter the admin password
4. On successful authentication, you'll be redirected to your original destination
5. Your session will remain active for **7 days**

### Logout

Click the "Logout" button in the top-right corner of any admin page to end your session.

## Security Features

- **Session-based authentication**: Uses secure HTTP-only cookies
- **7-day session expiration**: Sessions automatically expire after 7 days
- **Client-side route protection**: All admin pages check authentication on mount
- **API route protection**: Auth checking endpoint at `/api/admin/auth`

## Routes

### Protected Routes
- `/admin/newsletter` - Newsletter creation and sending
- `/admin/social` - Social media content generation

### Public Routes
- `/admin/login` - Login page

### API Routes
- `POST /api/admin/auth` - Authenticate with password
- `GET /api/admin/auth` - Check authentication status
- `DELETE /api/admin/auth` - Logout (delete session)

## Implementation Details

### Files Created

1. **Login Page**: `/apps/web/app/admin/login/page.tsx`
   - Simple password form
   - Redirects to returnTo URL on success

2. **Auth API**: `/apps/web/app/api/admin/auth/route.ts`
   - POST: Authenticate with password
   - GET: Check if authenticated
   - DELETE: Logout

3. **Auth Utilities**: `/apps/web/lib/admin-auth.ts`
   - Helper functions for server-side auth checking
   - Not currently used, but available for server components

4. **Protected Pages**:
   - `/apps/web/app/admin/newsletter/page.tsx` - Updated with auth check
   - `/apps/web/app/admin/social/page.tsx` - Updated with auth check

### Session Management

Sessions are stored in HTTP-only cookies named `admin_session` with:
- **HttpOnly**: true (prevents JavaScript access)
- **Secure**: true in production (HTTPS only)
- **SameSite**: lax (CSRF protection)
- **MaxAge**: 7 days
- **Path**: / (accessible site-wide)

### Password Storage

The password is **not** hashed or encrypted in this simple implementation. It's compared directly with the environment variable. This is suitable for:
- Internal tools with a single shared admin password
- Low to medium security requirements
- Trusted network environments

For higher security requirements, consider:
- Implementing proper password hashing (bcrypt, argon2)
- User-based authentication with individual accounts
- Two-factor authentication (2FA)
- Rate limiting on login attempts

## Troubleshooting

### "Admin authentication not configured" error

**Cause**: `ADMIN_PASSWORD` environment variable is not set.

**Solution**:
1. Add `ADMIN_PASSWORD` to your `.env.local` file
2. Restart your development server

### Redirected to login immediately after logging in

**Cause**: Cookie is not being set properly.

**Solutions**:
1. Check that you're not in incognito/private browsing mode
2. Ensure cookies are enabled in your browser
3. In development, ensure you're accessing via `localhost` or `127.0.0.1` (not a custom domain)
4. Check browser console for cookie errors

### Session expires too quickly

**Cause**: Session cookies are being deleted or not persisting.

**Solutions**:
1. Check browser privacy settings (don't block cookies)
2. Ensure you're not using "Clear cookies on exit" browser setting
3. Check that the cookie `admin_session` exists in browser DevTools

### Can't access admin tools after deployment

**Cause**: Environment variable not set in production.

**Solution**:
1. Verify `ADMIN_PASSWORD` is set in Vercel dashboard
2. Redeploy the application
3. Clear your browser cookies for the production domain
4. Try logging in again

## Future Enhancements

Potential improvements for production use:

1. **Rate Limiting**: Limit login attempts to prevent brute force attacks
2. **Password Hashing**: Store hashed passwords instead of plaintext comparison
3. **User Management**: Individual admin accounts with different permissions
4. **Audit Logging**: Track who accessed what and when
5. **2FA**: Two-factor authentication for additional security
6. **Session Revocation**: Ability to invalidate all sessions remotely
7. **IP Whitelisting**: Restrict admin access to specific IP addresses
8. **Failed Login Notifications**: Email alerts on failed login attempts

---

## Quick Reference

```bash
# Set password locally
echo "ADMIN_PASSWORD=your_secure_password" >> .env.local

# Restart dev server
npm run dev

# Login URL
open http://localhost:3000/admin/login

# Protected URLs
# http://localhost:3000/admin/newsletter
# http://localhost:3000/admin/social
```
