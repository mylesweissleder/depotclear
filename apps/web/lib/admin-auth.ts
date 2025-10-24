import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Check if admin is authenticated
 * Use this in Server Components to protect admin routes
 */
export async function requireAdminAuth(returnTo?: string) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');

  if (!session) {
    // Redirect to login with return URL
    const loginUrl = returnTo
      ? `/admin/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/admin/login';
    redirect(loginUrl);
  }

  return true;
}

/**
 * Check if admin is authenticated (non-throwing version)
 * Returns boolean instead of redirecting
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  return !!session;
}

/**
 * Logout admin user
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
}
