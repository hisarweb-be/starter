import "server-only"

import { createHmac } from "crypto"

import { prisma } from "@/lib/server/prisma"

const db = prisma as unknown as {
  webhook: {
    findMany: (args: Record<string, unknown>) => Promise<WebhookRecord[]>
  }
  webhookDelivery: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>
  }
}

type WebhookRecord = {
  id: string
  url: string
  secret: string
  events: string[]
  active: boolean
}

function signPayload(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex")
}

export async function dispatchWebhooks(
  organizationId: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const webhooks = await db.webhook.findMany({
    where: {
      organizationId,
      active: true,
    },
  })

  const matching = webhooks.filter((w) => w.events.includes(event) || w.events.includes("*"))

  await Promise.allSettled(
    matching.map((webhook) => deliverWebhook(webhook, event, payload))
  )
}

async function deliverWebhook(
  webhook: WebhookRecord,
  event: string,
  payload: Record<string, unknown>
): Promise<void> {
  const body = JSON.stringify({ event, data: payload, timestamp: Date.now() })
  const signature = signPayload(body, webhook.secret)
  const start = Date.now()

  let statusCode: number | null = null
  let success = false
  let response: string | null = null

  try {
    const res = await fetch(webhook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Signature": signature,
        "X-Webhook-Event": event,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    })

    statusCode = res.status
    success = res.ok
    response = await res.text().catch(() => null)
  } catch (err) {
    response = err instanceof Error ? err.message : "Unknown error"
  }

  const duration = Date.now() - start

  try {
    await db.webhookDelivery.create({
      data: {
        webhookId: webhook.id,
        event,
        statusCode,
        success,
        payload,
        response: response?.slice(0, 1000) ?? null,
        duration,
      },
    })
  } catch {
    console.error("[Webhooks] Failed to log delivery")
  }
}
