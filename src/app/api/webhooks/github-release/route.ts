import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || ""

/**
 * Verify GitHub webhook signature
 * GitHub sends X-Hub-Signature-256 header with HMAC-SHA256 signature
 */
function verifyGitHubSignature(payload: string, signature: string): boolean {
  if (!GITHUB_WEBHOOK_SECRET) {
    console.warn("[GitHub Webhook] GITHUB_WEBHOOK_SECRET not configured")
    return false
  }

  const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET)
  hmac.update(payload)
  const digest = `sha256=${hmac.digest("hex")}`

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
}

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const rawBody = await request.text()
    const signature = request.headers.get("x-hub-signature-256")

    if (!signature) {
      console.warn("[GitHub Webhook] Missing X-Hub-Signature-256 header")
      return NextResponse.json(
        { error: "Missing signature header" },
        { status: 401 }
      )
    }

    // Verify signature
    if (!verifyGitHubSignature(rawBody, signature)) {
      console.warn("[GitHub Webhook] Invalid signature")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    // Parse the payload
    const payload = JSON.parse(rawBody)
    const action = request.headers.get("x-github-event")

    // Handle release events
    if (action === "release") {
      const release = payload.release

      if (release && release.tag_name) {
        console.log(`[GitHub Webhook] Release: ${release.tag_name}`)

        // Import prisma dynamically
        const { prisma } = await import("@/lib/server/prisma")

        // Update or create LatestRelease record
        const latestRelease = await (
          prisma as unknown as {
            latestRelease: {
              upsert: (args: {
                where: { id: string }
                update: Record<string, unknown>
                create: Record<string, unknown>
              }) => Promise<{ id: string; tag: string }>
            }
          }
        ).latestRelease.upsert({
          where: { id: "singleton" },
          update: {
            tag: release.tag_name,
            releaseNotes: release.body || null,
            releaseUrl: release.html_url || null,
            downloadUrl: release.assets?.[0]?.browser_download_url || null,
            checkedAt: new Date(),
          },
          create: {
            id: "singleton",
            tag: release.tag_name,
            releaseNotes: release.body || null,
            releaseUrl: release.html_url || null,
            downloadUrl: release.assets?.[0]?.browser_download_url || null,
            checkedAt: new Date(),
          },
        })

        console.log(
          `[GitHub Webhook] Saved release: ${latestRelease.tag}`
        )

        return NextResponse.json(
          {
            success: true,
            tag: latestRelease.tag,
          },
          { status: 200 }
        )
      }
    }

    // Handle other events
    console.log(`[GitHub Webhook] Received event: ${action}`)
    return NextResponse.json(
      { received: true },
      { status: 200 }
    )
  } catch (error) {
    console.error("[GitHub Webhook] Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
