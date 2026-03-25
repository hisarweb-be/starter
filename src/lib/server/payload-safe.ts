import "server-only"

import { cache } from "react"

import type { Payload } from "payload"

/**
 * Returns a Payload instance if PAYLOAD_ENABLED=true.
 * Otherwise returns null so callers fall back to demo/wizard content.
 *
 * This prevents Payload from blocking the app with interactive
 * migration prompts when its database tables don't exist yet.
 */
export const getSafePayload = cache(async (): Promise<Payload | null> => {
  if (process.env.PAYLOAD_ENABLED !== "true") {
    return null
  }

  try {
    const { getPayload } = await import("payload")
    const configPromise = (await import("@/payload/payload.config")).default

    const payload = await Promise.race([
      getPayload({ config: configPromise }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8_000)),
    ])

    return payload
  } catch {
    return null
  }
})
