import { NextRequest } from 'next/server';
import { verifyToken, findUserById } from './auth';

/**
 * Extract JWT token from Authorization header
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verify the user's JWT token and return user data
 */
export async function authenticate(request: NextRequest) {
  const token = getTokenFromRequest(request);

  if (!token) {
    return { authenticated: false, user: null, error: 'No token provided' };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { authenticated: false, user: null, error: 'Invalid token' };
  }

  const user = await findUserById(payload.userId);
  if (!user) {
    return { authenticated: false, user: null, error: 'User not found' };
  }

  return { authenticated: true, user, error: null };
}

/**
 * Alias for authenticate() - for consistency across codebase
 */
export const authenticateRequest = authenticate;

/**
 * Verify the user is authenticated and has admin role
 */
export async function authenticateAdmin(request: NextRequest) {
  const authResult = await authenticate(request);

  if (!authResult.authenticated || !authResult.user) {
    return { success: false, user: null, error: authResult.error || 'Unauthorized' };
  }

  // Check if user has admin role
  if (authResult.user.role !== 'admin') {
    return { success: false, user: null, error: 'Admin access required' };
  }

  return { success: true, user: authResult.user, error: null };
}
