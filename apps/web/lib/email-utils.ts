/**
 * Normalize email addresses to prevent vote manipulation
 *
 * Handles common tricks like:
 * - Gmail + addressing: user+1@gmail.com -> user@gmail.com
 * - Gmail dots: u.s.e.r@gmail.com -> user@gmail.com
 * - Other providers with + addressing
 */
export function normalizeEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return email.toLowerCase();
  }

  const [localPart, domain] = email.toLowerCase().split('@');

  // Gmail-specific normalization
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Remove everything after + sign
    const baseLocal = localPart.split('+')[0];
    // Remove all dots (Gmail ignores them)
    const normalizedLocal = baseLocal.replace(/\./g, '');
    return `${normalizedLocal}@gmail.com`; // Always use gmail.com
  }

  // Other providers that support + addressing (but not dot removal)
  // Outlook, Yahoo, ProtonMail, iCloud, FastMail, etc.
  const plusSupportedDomains = [
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'yahoo.com', 'ymail.com', 'rocketmail.com',
    'protonmail.com', 'proton.me', 'pm.me',
    'icloud.com', 'me.com', 'mac.com',
    'fastmail.com', 'fastmail.fm',
    'zoho.com', 'zohomail.com'
  ];

  if (plusSupportedDomains.includes(domain)) {
    // Remove everything after + sign
    const baseLocal = localPart.split('+')[0];
    return `${baseLocal}@${domain}`;
  }

  // For all other domains, just lowercase
  return email.toLowerCase();
}

/**
 * Check if email is likely a throwaway/temporary email
 */
export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split('@')[1];

  // Common disposable email domains
  const disposableDomains = [
    'tempmail.com', 'throwaway.email', '10minutemail.com',
    'guerrillamail.com', 'mailinator.com', 'maildrop.cc',
    'temp-mail.org', 'getnada.com', 'fakeinbox.com'
  ];

  return disposableDomains.includes(domain);
}
