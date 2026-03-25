import "server-only"

/**
 * Response type for Supabase project creation
 */
interface SupabaseProjectResponse {
  projectId: string
  apiKey: string
  databaseUrl: string
}

/**
 * Supabase project info retrieved from API
 */
interface SupabaseProjectInfo {
  id: string
  name: string
  status: "ACTIVE_HEALTHY" | "ACTIVE_UNHEALTHY" | "CREATING" | "PAUSED"
  apiUrl: string
  anonKey: string
  serviceRoleKey: string
  region: string
  createdAt: string
}

/**
 * Create a new Supabase project using the Management API v1.
 *
 * Creates a new PostgreSQL-backed Supabase project with the following steps:
 * 1. Validates SUPABASE_ADMIN_TOKEN environment variable
 * 2. Generates a secure random 32-character database password
 * 3. Calls Supabase Management API (v1) to create the project
 * 4. Polls the project status until it becomes active (max 60 seconds)
 * 5. Retrieves API URL and anon key from the active project
 * 6. Constructs and returns the PostgreSQL connection string
 *
 * The function implements graceful error handling:
 * - Missing SUPABASE_ADMIN_TOKEN throws immediately
 * - API rate limiting (429) throws "Supabase API rate limited, retry in 60s"
 * - Project creation failures log error and return null (fallback to manual setup)
 * - Timeout after 60 seconds of polling returns null
 *
 * @param email - Email address associated with the project (for project metadata)
 * @param projectName - Human-readable name for the Supabase project
 * @returns Promise resolving to project credentials {projectId, apiKey, databaseUrl} or null on failure
 * @throws {Error} If SUPABASE_ADMIN_TOKEN is not set: "Setup requires SUPABASE_ADMIN_TOKEN env var"
 * @throws {Error} If API rate limited: "Supabase API rate limited, retry in 60s"
 *
 * @example
 * ```ts
 * try {
 *   const result = await createSupabaseProject(
 *     "user@example.com",
 *     "my-app-production"
 *   );
 *   if (result) {
 *     console.log(`Project created: ${result.projectId}`);
 *     // Use result.databaseUrl for DATABASE_URL env var
 *   } else {
 *     console.log("Project creation timed out, manual setup required");
 *   }
 * } catch (error) {
 *   console.error("Setup requires SUPABASE_ADMIN_TOKEN env var");
 * }
 * ```
 */
export async function createSupabaseProject(
  email: string,
  projectName: string
): Promise<SupabaseProjectResponse | null> {
  const adminToken = process.env.SUPABASE_ADMIN_TOKEN
  if (!adminToken) {
    throw new Error("Setup requires SUPABASE_ADMIN_TOKEN env var")
  }

  const region = process.env.SUPABASE_REGION || "eu-central-1"
  const dbPassword = generateSecurePassword(32)

  try {
    // Step 1: Create the project via Management API v1
    const createResponse = await fetch(
      "https://api.supabase.com/api/v1/projects",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: projectName,
          db_pass: dbPassword,
          region: region,
        }),
      }
    )

    // Handle rate limiting
    if (createResponse.status === 429) {
      throw new Error("Supabase API rate limited, retry in 60s")
    }

    if (!createResponse.ok) {
      const errorData = await createResponse.text()
      console.error(
        `[Supabase] Failed to create project: ${createResponse.status}`,
        errorData
      )
      return null
    }

    const projectData = (await createResponse.json()) as {
      id: string
      name: string
    }
    const projectId = projectData.id

    // Step 2: Poll for project to become active (max 60 seconds)
    const project = await waitForProjectActive(projectId, adminToken)
    if (!project) {
      console.error(`[Supabase] Project ${projectId} did not become active within 60s`)
      return null
    }

    // Step 3: Construct the database URL from project details
    const databaseUrl = constructDatabaseUrl(project.apiUrl, projectId, dbPassword)

    return {
      projectId: project.id,
      apiKey: project.anonKey,
      databaseUrl,
    }
  } catch (error) {
    // Re-throw rate limit and token errors
    if (error instanceof Error && error.message.includes("rate limited")) {
      throw error
    }
    if (error instanceof Error && error.message.includes("SUPABASE_ADMIN_TOKEN")) {
      throw error
    }
    console.error("[Supabase] Project creation failed:", error)
    return null
  }
}

/**
 * Validate a Supabase database connection string.
 *
 * Performs validation of a PostgreSQL connection string to ensure:
 * 1. It is a valid PostgreSQL protocol URI (postgresql:// or postgres://)
 * 2. Required components are present (hostname, database name)
 * 3. The connection string format is correct
 *
 * Note: This function performs format validation only. For full validation,
 * use a database client library to attempt an actual connection.
 *
 * @param connectionString - PostgreSQL connection string (format: postgresql://user:pass@host:port/database)
 * @returns Promise<boolean> - True if connection string is valid format, false otherwise
 *
 * @example
 * ```ts
 * const isValid = await validateSupabaseConnection(
 *   "postgresql://postgres:password@db.supabase.co:5432/postgres"
 * );
 * if (isValid) {
 *   console.log("Connection string is valid");
 * }
 * ```
 */
export async function validateSupabaseConnection(
  connectionString: string
): Promise<boolean> {
  try {
    // Parse as URL to validate format
    const url = new URL(connectionString)

    // Verify protocol is PostgreSQL
    if (!url.protocol.startsWith("postgres")) {
      return false
    }

    // Verify required components
    const hostname = url.hostname
    const database = url.pathname.slice(1)

    // Both hostname and database name are required
    if (!hostname || !database) {
      return false
    }

    return true
  } catch {
    // URL parsing failed
    return false
  }
}

/**
 * Retrieve detailed information about an existing Supabase project.
 *
 * Fetches project details from the Supabase Management API v1 including:
 * - Project ID, name, and current status (ACTIVE_HEALTHY, CREATING, PAUSED, etc.)
 * - API URL for REST and GraphQL endpoints
 * - Anon and Service Role API keys
 * - Deployment region
 * - Project creation timestamp
 *
 * Requires SUPABASE_ADMIN_TOKEN to be set in environment variables.
 *
 * @param projectId - Supabase project ID (format: typically a 6-8 character alphanumeric string)
 * @returns Promise<SupabaseProjectInfo | null> - Complete project information or null if not found/error
 * @throws {Error} If SUPABASE_ADMIN_TOKEN is not set: "Setup requires SUPABASE_ADMIN_TOKEN env var"
 * @throws {Error} If API rate limited: "Supabase API rate limited, retry in 60s"
 *
 * @example
 * ```ts
 * const info = await getSupabaseProjectInfo("abc123def456");
 * if (info) {
 *   console.log(`Project status: ${info.status}`);
 *   console.log(`API URL: ${info.apiUrl}`);
 *   console.log(`Region: ${info.region}`);
 * } else {
 *   console.log("Project not found");
 * }
 * ```
 */
export async function getSupabaseProjectInfo(
  projectId: string
): Promise<SupabaseProjectInfo | null> {
  const adminToken = process.env.SUPABASE_ADMIN_TOKEN
  if (!adminToken) {
    throw new Error("Setup requires SUPABASE_ADMIN_TOKEN env var")
  }

  try {
    const response = await fetch(
      `https://api.supabase.com/api/v1/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      }
    )

    // Project not found
    if (response.status === 404) {
      return null
    }

    // Handle rate limiting
    if (response.status === 429) {
      throw new Error("Supabase API rate limited, retry in 60s")
    }

    if (!response.ok) {
      console.error(`[Supabase] Failed to fetch project info: ${response.status}`)
      return null
    }

    const data = (await response.json()) as {
      id: string
      name: string
      status: string
      api_url: string
      anon_key: string
      service_role_key: string
      region: string
      created_at: string
    }

    return {
      id: data.id,
      name: data.name,
      status: parseProjectStatus(data.status),
      apiUrl: data.api_url,
      anonKey: data.anon_key,
      serviceRoleKey: data.service_role_key,
      region: data.region,
      createdAt: data.created_at,
    }
  } catch (error) {
    // Re-throw rate limit and token errors
    if (error instanceof Error && error.message.includes("rate limited")) {
      throw error
    }
    if (error instanceof Error && error.message.includes("SUPABASE_ADMIN_TOKEN")) {
      throw error
    }
    console.error("[Supabase] Failed to retrieve project info:", error)
    return null
  }
}

/**
 * Generate a cryptographically secure random password.
 *
 * Uses the Web Crypto API (available in Node.js 15+) to generate a secure
 * random password with mixed character types including uppercase, lowercase,
 * digits, and special characters.
 *
 * @param length - Password length in characters (default: 32)
 * @returns Secure random password string of specified length
 * @internal
 */
function generateSecurePassword(length: number = 32): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
  let password = ""

  // Use crypto.getRandomValues for cryptographically secure randomness
  if (typeof globalThis.crypto !== "undefined") {
    const randomValues = new Uint32Array(length)
    globalThis.crypto.getRandomValues(randomValues)

    for (let i = 0; i < length; i++) {
      password += chars[randomValues[i] % chars.length]
    }

    return password
  }

  // Fallback for environments without crypto (shouldn't occur in Node.js 15+)
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)]
  }

  return password
}

/**
 * Wait for a Supabase project to become active.
 *
 * Polls the project status endpoint every 2 seconds until the project
 * reaches ACTIVE_HEALTHY status or 60 seconds have elapsed.
 *
 * @param projectId - Supabase project ID
 * @param adminToken - Supabase admin token for API authentication
 * @returns Promise<SupabaseProjectInfo | null> - Active project info or null on timeout
 * @internal
 */
async function waitForProjectActive(
  projectId: string,
  adminToken: string
): Promise<SupabaseProjectInfo | null> {
  const maxAttempts = 30 // 60 seconds with 2-second intervals
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(
        `https://api.supabase.com/api/v1/projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      )

      if (!response.ok) {
        console.error(
          `[Supabase] Status check failed: ${response.status}`,
          await response.text()
        )
        attempts++
        await delay(2000)
        continue
      }

      const data = (await response.json()) as {
        id: string
        name: string
        status: string
        api_url: string
        anon_key: string
        service_role_key: string
        region: string
        created_at: string
      }

      const status = parseProjectStatus(data.status)
      if (status === "ACTIVE_HEALTHY") {
        return {
          id: data.id,
          name: data.name,
          status,
          apiUrl: data.api_url,
          anonKey: data.anon_key,
          serviceRoleKey: data.service_role_key,
          region: data.region,
          createdAt: data.created_at,
        }
      }

      attempts++
      await delay(2000)
    } catch (error) {
      console.error("[Supabase] Error polling project status:", error)
      attempts++
      await delay(2000)
    }
  }

  return null
}

/**
 * Parse and normalize Supabase project status string.
 *
 * Converts raw API status values to standardized status types.
 *
 * @param status - Raw status string from Supabase API
 * @returns Normalized status type
 * @internal
 */
function parseProjectStatus(
  status: string
): "ACTIVE_HEALTHY" | "ACTIVE_UNHEALTHY" | "CREATING" | "PAUSED" {
  const normalized = status.toUpperCase()

  if (normalized.includes("ACTIVE") && normalized.includes("HEALTHY")) {
    return "ACTIVE_HEALTHY"
  }
  if (normalized.includes("ACTIVE")) {
    return "ACTIVE_UNHEALTHY"
  }
  if (normalized.includes("CREATING")) {
    return "CREATING"
  }
  if (normalized.includes("PAUSED")) {
    return "PAUSED"
  }

  return "CREATING"
}

/**
 * Construct a PostgreSQL connection URL from Supabase project details.
 *
 * Formats the connection string for PostgreSQL client libraries:
 * postgresql://postgres:<password>@<host>:<port>/<database>
 *
 * @param apiUrl - Supabase project REST API URL (format: https://projectid.supabase.co)
 * @param projectId - Supabase project ID (for reference)
 * @param password - Database password for postgres user
 * @returns PostgreSQL connection string
 * @internal
 */
function constructDatabaseUrl(
  apiUrl: string,
  projectId: string,
  password: string
): string {
  // Parse API URL to extract hostname
  // Example: https://abc123.supabase.co -> abc123.supabase.co
  const url = new URL(apiUrl)
  const host = url.hostname

  // Construct PostgreSQL connection string
  // Format: postgresql://postgres:password@host:5432/postgres
  return `postgresql://postgres:${encodeURIComponent(password)}@${host}:5432/postgres`
}

/**
 * Delay execution for a specified number of milliseconds.
 *
 * @param ms - Milliseconds to delay
 * @internal
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
