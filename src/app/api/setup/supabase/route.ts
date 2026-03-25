import { createSupabaseProject } from "@/lib/server/supabase-setup"
import { z } from "zod"

const supabaseSetupSchema = z.object({
  email: z.string().email("Invalid email format"),
  projectName: z.string().min(3, "Project name must be at least 3 characters").max(63, "Project name too long"),
})

export type SupabaseSetupRequest = z.input<typeof supabaseSetupSchema>

export interface SupabaseSetupResponse {
  success: boolean
  projectId?: string
  apiKey?: string
  databaseUrl?: string
  error?: string
}

/**
 * POST /api/setup/supabase
 * Handles automatic Supabase project creation during wizard step 1
 *
 * Request: { email: string; projectName: string }
 * Response: { success: boolean; projectId?; apiKey?; databaseUrl?; error? }
 */
export async function POST(request: Request): Promise<Response> {
  try {
    // Only POST is allowed
    if (request.method !== "POST") {
      return Response.json({ success: false, error: "Method not allowed" }, { status: 405 })
    }

    // Check if SUPABASE_ADMIN_TOKEN is configured
    if (!process.env.SUPABASE_ADMIN_TOKEN) {
      console.warn("[supabase-setup] SUPABASE_ADMIN_TOKEN not configured")
      return Response.json(
        {
          success: false,
          error: "Server not configured for auto-setup. Please configure SUPABASE_ADMIN_TOKEN and try again.",
        },
        { status: 401 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = supabaseSetupSchema.safeParse(body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]
      return Response.json(
        {
          success: false,
          error: firstError?.message || "Invalid request data",
        },
        { status: 400 }
      )
    }

    const { email, projectName } = validation.data

    // Call Supabase setup function
    const result = await createSupabaseProject(email, projectName)

    if (!result) {
      return Response.json(
        {
          success: false,
          error: "Failed to create Supabase project. No result returned.",
        },
        { status: 500 }
      )
    }

    return Response.json({
      success: true,
      projectId: result.projectId,
      apiKey: result.apiKey,
      databaseUrl: result.databaseUrl,
    })
  } catch (error) {
    console.error("[supabase-setup] Error:", error)

    const message = error instanceof Error ? error.message : "Failed to create Supabase project"

    // Determine appropriate HTTP status code
    let status = 500
    if (message.includes("Invalid") || message.includes("must be")) {
      status = 400
    } else if (message.includes("not configured")) {
      status = 401
    }

    return Response.json(
      {
        success: false,
        error: "Failed to create Supabase project. Try manual setup or contact support.",
      },
      { status }
    )
  }
}
