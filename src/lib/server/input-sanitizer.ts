import "server-only"

/**
 * Input sanitization utilities for server-side validation.
 * These help prevent XSS, injection, and other input-based attacks.
 */

/**
 * Strip HTML tags from a string to prevent XSS.
 * @param input - String that may contain HTML
 * @returns Sanitized string without HTML tags
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "")
}

/**
 * Escape HTML special characters.
 * @param input - String to escape
 * @returns Escaped string safe for HTML display
 */
export function escapeHtml(input: string): string {
  const escapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  }
  return input.replace(/[&<>"'/]/g, (char) => escapeMap[char] || char)
}

/**
 * Normalize whitespace (trim and collapse multiple spaces).
 * @param input - String with potentially excessive whitespace
 * @returns Normalized string
 */
export function normalizeWhitespace(input: string): string {
  return input.trim().replace(/\s+/g, " ")
}

/**
 * Validate and sanitize an email address.
 * @param email - Email address to validate
 * @returns Sanitized email or null if invalid
 */
export function sanitizeEmail(email: string): string | null {
  const sanitized = email.toLowerCase().trim()
  // Basic email regex - for production, consider using a library
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(sanitized) ? sanitized : null
}

/**
 * Sanitize a URL slug.
 * @param slug - Potential URL slug
 * @returns Sanitized slug safe for URLs
 */
export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Check for potential SQL injection patterns.
 * @param input - String to check
 * @returns True if potential injection detected
 */
export function containsSqlInjection(input: string): boolean {
  const patterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE)\b)/i,
    /(--)|(;)|(\/\*)/,
    /(OR|AND)\s+\d+=\d+/i,
    /'\s*(OR|AND)\s*'/i,
  ]
  return patterns.some((pattern) => pattern.test(input))
}

/**
 * Check for potential NoSQL injection patterns.
 * @param input - String to check
 * @returns True if potential injection detected
 */
export function containsNoSqlInjection(input: string): boolean {
  const patterns = [
    /\$where/i,
    /\$gt|\$lt|\$ne|\$eq/i,
    /\$regex/i,
    /\$or|\$and/i,
  ]
  return patterns.some((pattern) => pattern.test(input))
}

/**
 * Comprehensive input sanitization.
 * @param input - Raw input string
 * @param options - Sanitization options
 * @returns Sanitized string or null if input is suspicious
 */
export function sanitizeInput(
  input: string,
  options: {
    maxLength?: number
    stripHtml?: boolean
    normalizeWhitespace?: boolean
    checkInjection?: boolean
  } = {}
): string | null {
  const {
    maxLength = 10000,
    stripHtml: shouldStripHtml = true,
    normalizeWhitespace: shouldNormalizeWhitespace = true,
    checkInjection = true,
  } = options

  // Check length first
  if (input.length > maxLength) {
    return null
  }

  // Check for injection attempts
  if (checkInjection) {
    if (containsSqlInjection(input) || containsNoSqlInjection(input)) {
      console.warn("[SECURITY] Potential injection attempt detected")
      return null
    }
  }

  let sanitized = input

  if (shouldStripHtml) {
    sanitized = stripHtml(sanitized)
  }

  if (shouldNormalizeWhitespace) {
    sanitized = normalizeWhitespace(sanitized)
  }

  return sanitized
}

/**
 * Validate that an object only contains expected keys.
 * Prevents prototype pollution and unexpected properties.
 * @param obj - Object to validate
 * @param allowedKeys - Set of allowed key names
 * @returns True if object only contains allowed keys
 */
export function validateObjectKeys(
  obj: Record<string, unknown>,
  allowedKeys: Set<string>
): boolean {
  const keys = Object.keys(obj)

  // Check for prototype pollution attempts
  const dangerousKeys = ["__proto__", "constructor", "prototype"]
  if (keys.some((key) => dangerousKeys.includes(key))) {
    console.warn("[SECURITY] Prototype pollution attempt detected")
    return false
  }

  // Check for unexpected keys
  return keys.every((key) => allowedKeys.has(key))
}
