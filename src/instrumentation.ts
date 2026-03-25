/**
 * Next.js Instrumentation
 * This runs once when the server starts.
 * https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

export async function register() {
  // Only run on server
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { enforceSecretSecurity } = await import("@/lib/server/secrets-validator")

    // Validate secrets at startup
    // Throws in production if secrets are insecure
    enforceSecretSecurity({
      throwOnError: process.env.NODE_ENV === "production",
      logWarnings: true,
    })

    console.log("[SECURITY] Secret validation completed")
  }
}
