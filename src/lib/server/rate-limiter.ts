import "server-only"

/**
 * Simple in-memory rate limiter for auth endpoints.
 * For production, consider using Redis-backed rate limiting.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
  blocked: boolean
  blockedUntil?: number
}

interface RateLimitConfig {
  /** Maximum requests allowed within the window */
  maxRequests: number
  /** Time window in milliseconds */
  windowMs: number
  /** Block duration after limit exceeded (ms) */
  blockDurationMs: number
  /** Key prefix for namespacing */
  keyPrefix?: string
}

// In-memory store (use Redis in production for distributed systems)
const store = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically
const CLEANUP_INTERVAL_MS = 60000 // 1 minute
let cleanupTimer: NodeJS.Timeout | null = null

function startCleanup() {
  if (cleanupTimer) return

  cleanupTimer = setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store.entries()) {
      // Remove entries that have expired and are not blocked
      if (entry.resetAt < now && !entry.blocked) {
        store.delete(key)
      }
      // Remove expired blocks
      if (entry.blocked && entry.blockedUntil && entry.blockedUntil < now) {
        store.delete(key)
      }
    }
  }, CLEANUP_INTERVAL_MS)

  // Don't prevent process exit
  cleanupTimer.unref()
}

startCleanup()

/**
 * Default rate limit configurations
 */
export const RATE_LIMITS = {
  /** Auth endpoints: 5 attempts per 15 minutes, block for 30 minutes */
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
    blockDurationMs: 30 * 60 * 1000,
    keyPrefix: "auth",
  } satisfies RateLimitConfig,

  /** Password reset: 3 attempts per hour, block for 1 hour */
  passwordReset: {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
    keyPrefix: "pwd-reset",
  } satisfies RateLimitConfig,

  /** Contact form: 5 submissions per hour */
  contact: {
    maxRequests: 5,
    windowMs: 60 * 60 * 1000,
    blockDurationMs: 60 * 60 * 1000,
    keyPrefix: "contact",
  } satisfies RateLimitConfig,

  /** API general: 100 requests per minute */
  api: {
    maxRequests: 100,
    windowMs: 60 * 1000,
    blockDurationMs: 5 * 60 * 1000,
    keyPrefix: "api",
  } satisfies RateLimitConfig,
} as const

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
  blocked: boolean
  blockedUntil?: number
  retryAfterMs?: number
}

/**
 * Check and update rate limit for a given identifier.
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const key = config.keyPrefix ? `${config.keyPrefix}:${identifier}` : identifier
  const now = Date.now()

  let entry = store.get(key)

  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil) {
    if (now < entry.blockedUntil) {
      return {
        success: false,
        remaining: 0,
        resetAt: entry.blockedUntil,
        blocked: true,
        blockedUntil: entry.blockedUntil,
        retryAfterMs: entry.blockedUntil - now,
      }
    }
    // Block expired, reset entry
    entry = undefined
  }

  // Create new entry or reset if window expired
  if (!entry || entry.resetAt < now) {
    entry = {
      count: 1,
      resetAt: now + config.windowMs,
      blocked: false,
    }
    store.set(key, entry)

    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetAt: entry.resetAt,
      blocked: false,
    }
  }

  // Increment count
  entry.count++

  // Check if limit exceeded
  if (entry.count > config.maxRequests) {
    entry.blocked = true
    entry.blockedUntil = now + config.blockDurationMs
    store.set(key, entry)

    return {
      success: false,
      remaining: 0,
      resetAt: entry.blockedUntil,
      blocked: true,
      blockedUntil: entry.blockedUntil,
      retryAfterMs: config.blockDurationMs,
    }
  }

  store.set(key, entry)

  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    blocked: false,
  }
}

/**
 * Get client identifier from request headers.
 * Uses X-Forwarded-For for proxied requests, falls back to a default.
 */
export function getClientIdentifier(headers: Headers): string {
  // Check for forwarded IP (behind proxy/load balancer)
  const forwarded = headers.get("x-forwarded-for")
  if (forwarded) {
    // Take the first IP (original client)
    return forwarded.split(",")[0].trim()
  }

  // Check for real IP header
  const realIp = headers.get("x-real-ip")
  if (realIp) {
    return realIp.trim()
  }

  // Fallback - in production, this should be configured properly
  return "unknown"
}

/**
 * Reset rate limit for an identifier (e.g., after successful auth).
 */
export function resetRateLimit(identifier: string, keyPrefix?: string): void {
  const key = keyPrefix ? `${keyPrefix}:${identifier}` : identifier
  store.delete(key)
}

/**
 * Create rate limit headers for response.
 */
export function createRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    "X-RateLimit-Remaining": String(result.remaining),
    "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
  }

  if (!result.success) {
    headers["Retry-After"] = String(Math.ceil((result.retryAfterMs ?? 0) / 1000))
  }

  return headers
}
