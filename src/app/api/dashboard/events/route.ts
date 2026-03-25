import { type NextRequest } from "next/server"

import { auth } from "@/auth"
import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  page: { count: (args: Record<string, unknown>) => Promise<number> }
  media: { count: (args: Record<string, unknown>) => Promise<number> }
  contactInquiry: { count: (args?: Record<string, unknown>) => Promise<number> }
}

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return new Response("Niet geautoriseerd", { status: 401 })
  }

  const orgId = (session.user as { organizationId?: string }).organizationId

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      async function sendStats() {
        try {
          const where = orgId ? { organizationId: orgId } : {}
          const [pages, media, inquiries] = await Promise.all([
            db.page.count({ where }),
            db.media.count({ where }),
            db.contactInquiry.count(),
          ])

          const data = JSON.stringify({ pages, media, inquiries, timestamp: Date.now() })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        } catch {
          // Silently ignore errors during polling
        }
      }

      // Send initial data
      await sendStats()

      // Poll every 30 seconds
      const interval = setInterval(sendStats, 30_000)

      // Clean up on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
