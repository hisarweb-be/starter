import bcrypt from "bcrypt"
import { randomBytes, timingSafeEqual } from "crypto"

const BCRYPT_ROUNDS = 12

/**
 * Hash a password using bcrypt with secure work factor.
 * @param password - Plain text password
 * @returns Promise<string> - Bcrypt hash
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS)
}

/**
 * Verify a password against a bcrypt hash.
 * Uses constant-time comparison to prevent timing attacks.
 * @param password - Plain text password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  // Handle legacy SHA-256 hashes during migration period
  if (!hash.startsWith("$2")) {
    // This is a legacy SHA-256 hash - always reject for security
    // Admin must reset password through secure channel
    console.warn(
      "[SECURITY] Legacy SHA-256 hash detected. Password reset required."
    )
    return false
  }

  return bcrypt.compare(password, hash)
}

/**
 * Check if a hash is a legacy format that needs migration.
 * @param hash - The stored hash
 * @returns boolean - True if hash needs migration to bcrypt
 */
export function isLegacyHash(hash: string): boolean {
  // Bcrypt hashes start with $2a$, $2b$, or $2y$
  return !hash.startsWith("$2")
}

/**
 * Generate a cryptographically secure random token.
 * @param length - Length of the token in bytes (default: 32)
 * @returns string - Hex-encoded random token
 */
export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString("hex")
}

/**
 * Constant-time string comparison to prevent timing attacks.
 * @param a - First string
 * @param b - Second string
 * @returns boolean - True if strings are equal
 */
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Still do the comparison to maintain constant time
    timingSafeEqual(Buffer.from(a), Buffer.from(a))
    return false
  }
  return timingSafeEqual(Buffer.from(a), Buffer.from(b))
}
