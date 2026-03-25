import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import type { Redis as RedisType } from "@upstash/redis"

// In-memory fallback voor development zonder Redis
const memory = new Map()

function getRedisInstance() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  
  // In-memory fallback
  return {
    get: async (key: string) => memory.get(key),
    set: async (key: string, value: string, options?: { ex?: number }) => {
      memory.set(key, value)
      if (options?.ex) {
        setTimeout(() => memory.delete(key), options.ex * 1000)
      }
    },
    incr: async (key: string) => {
      const current = memory.get(key) || 0
      const next = current + 1
      memory.set(key, next)
      return next
    },
    expire: async (key: string, seconds: number) => {
      setTimeout(() => memory.delete(key), seconds * 1000)
    },
  } as unknown as RedisType
}

// Rate limiters for different endpoints
export const loginRateLimit = new Ratelimit({
  redis: getRedisInstance(),
  limiter: Ratelimit.slidingWindow(5, "1m"), // 5 attempts per minute
  analytics: true,
})

export const contactRateLimit = new Ratelimit({
  redis: getRedisInstance(),
  limiter: Ratelimit.slidingWindow(3, "1m"), // 3 contact forms per minute
  analytics: true,
})

export const registerRateLimit = new Ratelimit({
  redis: getRedisInstance(),
  limiter: Ratelimit.slidingWindow(2, "1m"), // 2 registrations per minute
  analytics: true,
})

export const resetPasswordRateLimit = new Ratelimit({
  redis: getRedisInstance(),
  limiter: Ratelimit.slidingWindow(3, "5m"), // 3 password resets per 5 minutes
  analytics: true,
})

export const generalApiRateLimit = new Ratelimit({
  redis: getRedisInstance(),
  limiter: Ratelimit.slidingWindow(30, "1m"), // 30 requests per minute for general API
  analytics: true,
})

/**
 * Get client IP address from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIP = request.headers.get("x-real-ip")
  const remoteAddr = request.headers.get("remote-addr")
  
  if (forwarded) {
    return forwarded.split(",")[0].trim()
  }
  
  return realIP || remoteAddr || "127.0.0.1"
}

/**
 * Apply rate limiting to a request
 */
export async function applyRateLimit(
  rateLimit: Ratelimit,
  identifier: string
): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
  try {
    const result = await rateLimit.limit(identifier)
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: new Date(result.reset),
    }
  } catch (error) {
    console.error("Rate limiting error:", error)
    // Fail open in case of Redis issues
    return {
      success: true,
      limit: 100,
      remaining: 99,
      reset: new Date(Date.now() + 60000),
    }
  }
}

/**
 * Create rate limit response when limit is exceeded
 */
export function createRateLimitResponse(result: {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}): Response {
  return new Response(
    JSON.stringify({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: Math.ceil((result.reset.getTime() - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
        "X-RateLimit-Reset": result.reset.getTime().toString(),
        "Retry-After": Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
      },
    }
  )
}