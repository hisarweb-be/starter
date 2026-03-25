import "server-only"
import { randomBytes } from "crypto"

/**
 * Security: Validates that critical secrets are properly configured.
 * This prevents deployment with default/weak secrets.
 */

const WEAK_SECRETS = [
  "replace-me",
  "dev-payload-secret",
  "dev-nextauth-secret",
  "changeme",
  "secret",
  "password",
  "123456",
  "admin",
  "test",
]

const MIN_SECRET_LENGTH = 32

interface SecretValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates that a secret meets security requirements.
 */
function validateSecret(
  name: string,
  value: string | undefined,
  required: boolean = true
): { error?: string; warning?: string } {
  if (!value || value.trim() === "") {
    if (required) {
      return { error: `${name} is not set` }
    }
    return {}
  }

  const lowerValue = value.toLowerCase()

  // Check for weak/default secrets
  for (const weak of WEAK_SECRETS) {
    if (lowerValue === weak || lowerValue.includes(weak)) {
      return {
        error: `${name} contains a weak/default value. Please generate a secure random secret.`,
      }
    }
  }

  // Check minimum length
  if (value.length < MIN_SECRET_LENGTH) {
    return {
      warning: `${name} is shorter than recommended (${value.length} < ${MIN_SECRET_LENGTH} chars)`,
    }
  }

  return {}
}

/**
 * Validates all critical secrets in the environment.
 * Call this at application startup.
 */
export function validateSecrets(): SecretValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Critical secrets that must be set and secure
  const criticalSecrets = [
    { name: "PAYLOAD_SECRET", value: process.env.PAYLOAD_SECRET, required: true },
    { name: "NEXTAUTH_SECRET", value: process.env.NEXTAUTH_SECRET, required: true },
  ]

  // Optional secrets that should be secure if set
  const optionalSecrets = [
    { name: "AUTH_GOOGLE_SECRET", value: process.env.AUTH_GOOGLE_SECRET },
    { name: "AUTH_GITHUB_SECRET", value: process.env.AUTH_GITHUB_SECRET },
    { name: "CLOUDINARY_API_SECRET", value: process.env.CLOUDINARY_API_SECRET },
  ]

  // Validate critical secrets
  for (const { name, value, required } of criticalSecrets) {
    const result = validateSecret(name, value, required)
    if (result.error) errors.push(result.error)
    if (result.warning) warnings.push(result.warning)
  }

  // Validate optional secrets (only if set)
  for (const { name, value } of optionalSecrets) {
    if (value) {
      const result = validateSecret(name, value, false)
      if (result.error) errors.push(result.error)
      if (result.warning) warnings.push(result.warning)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Logs secret validation results and optionally throws on errors.
 * Use in application startup.
 */
export function enforceSecretSecurity(options: {
  throwOnError?: boolean
  logWarnings?: boolean
} = {}): void {
  const { throwOnError = process.env.NODE_ENV === "production", logWarnings = true } = options

  const result = validateSecrets()

  // Log warnings
  if (logWarnings && result.warnings.length > 0) {
    console.warn("[SECURITY] Secret validation warnings:")
    result.warnings.forEach((w) => console.warn(`  ⚠️  ${w}`))
  }

  // Handle errors
  if (!result.isValid) {
    console.error("[SECURITY] Secret validation failed:")
    result.errors.forEach((e) => console.error(`  ❌ ${e}`))

    if (throwOnError) {
      throw new Error(
        `Security validation failed: ${result.errors.length} error(s). ` +
          "Please configure secure secrets before deploying to production."
      )
    } else {
      console.warn(
        "[SECURITY] Running with insecure secrets. " +
          "This is only acceptable in development mode."
      )
    }
  }
}

/**
 * Generate a secure random secret suitable for NEXTAUTH_SECRET or PAYLOAD_SECRET.
 */
export function generateSecureSecret(): string {
  return randomBytes(32).toString("base64url")
}
