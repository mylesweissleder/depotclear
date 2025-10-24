import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sql } from '@vercel/postgres';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  created_at: Date;
  email_verified: boolean;
}

export interface JWTPayload {
  userId: number;
  email: string;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Compare a password with a hash
 */
export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 */
export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Generate a random token (for email verification, password reset, etc.)
 */
export function generateRandomToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Create a new user
 */
export async function createUser(email: string, password: string, name?: string, phone?: string) {
  const passwordHash = await hashPassword(password);
  const verificationToken = generateRandomToken();

  const result = await sql`
    INSERT INTO users (email, password_hash, name, phone, email_verification_token)
    VALUES (${email}, ${passwordHash}, ${name || null}, ${phone || null}, ${verificationToken})
    RETURNING id, email, name, phone, created_at, email_verified
  `;

  return { user: result.rows[0] as User, verificationToken };
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string) {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `;
  return result.rows[0] || null;
}

/**
 * Find user by ID
 */
export async function findUserById(id: number) {
  const result = await sql`
    SELECT id, email, name, phone, created_at, email_verified, last_login_at
    FROM users
    WHERE id = ${id}
  `;
  return result.rows[0] as User | null;
}

/**
 * Update last login time
 */
export async function updateLastLogin(userId: number) {
  await sql`
    UPDATE users
    SET last_login_at = CURRENT_TIMESTAMP
    WHERE id = ${userId}
  `;
}

/**
 * Verify email with token
 */
export async function verifyEmail(token: string) {
  const result = await sql`
    UPDATE users
    SET email_verified = true, email_verification_token = NULL
    WHERE email_verification_token = ${token}
    RETURNING id, email
  `;
  return result.rows[0] || null;
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(email: string) {
  const token = generateRandomToken();
  const expires = new Date(Date.now() + 3600000); // 1 hour

  const result = await sql`
    UPDATE users
    SET password_reset_token = ${token}, password_reset_expires = ${expires.toISOString()}
    WHERE email = ${email}
    RETURNING id
  `;

  return result.rows[0] ? token : null;
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string) {
  const passwordHash = await hashPassword(newPassword);

  const result = await sql`
    UPDATE users
    SET password_hash = ${passwordHash},
        password_reset_token = NULL,
        password_reset_expires = NULL
    WHERE password_reset_token = ${token}
      AND password_reset_expires > CURRENT_TIMESTAMP
    RETURNING id, email
  `;

  return result.rows[0] || null;
}
