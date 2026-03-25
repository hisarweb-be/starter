import { submitContactInquiry } from "@/lib/server/contact-submission"
import { contactRateLimit, getClientIP, applyRateLimit, createRateLimitResponse } from "@/lib/server/rate-limit"
import { Resend } from "resend"
import { prisma } from "@/lib/server/prisma"
import { z } from "zod"

// Lazy init to avoid build-time errors when RESEND_API_KEY is not set
function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder")
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().email("Invalid email address").max(255, "Email too long"),
  subject: z.string().min(2, "Subject must be at least 2 characters").max(200, "Subject too long").optional(),
  message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message too long"),
  organizationId: z.string().optional(),
})

const db = prisma as unknown as {
  organization: {
    findFirst: (args: Record<string, unknown>) => Promise<{
      id: string
      name: string
      siteName: string | null
      owner: { email: string } | null
    } | null>
  }
  contactInquiry: {
    create: (args: Record<string, unknown>) => Promise<unknown>
  }
}

export async function POST(request: Request) {
  try {
    // 1. CSRF Protection - Check Origin header
    const origin = request.headers.get("origin")
    const host = request.headers.get("host")
    const allowedOrigins = [
      process.env.NEXT_PUBLIC_APP_URL,
      `http://${host}`,
      `https://${host}`,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean)

    if (origin && !allowedOrigins.includes(origin)) {
      console.warn(`CSRF attempt blocked - Invalid origin: ${origin}`)
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    // 2. Rate Limiting
    const clientIP = getClientIP(request)
    const rateLimitResult = await applyRateLimit(contactRateLimit, `contact:${clientIP}`)

    if (!rateLimitResult.success) {
      console.warn(`Rate limit exceeded for contact API from IP: ${clientIP}`)
      return createRateLimitResponse(rateLimitResult)
    }

    // 3. Input Validation
    const body = await request.json()
    const validationResult = contactSchema.safeParse(body)

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: "Ongeldige invoer.",
          errors: validationResult.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 400 }
      )
    }

    const { name, email, message, organizationId, subject } = validationResult.data

    const responseHeaders: HeadersInit = {
      "X-RateLimit-Limit": rateLimitResult.limit.toString(),
      "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
      "X-RateLimit-Reset": rateLimitResult.reset.getTime().toString(),
    }

    // 4a. Org-specific path: lookup org and send via Resend directly
    if (organizationId) {
      const org = await db.organization.findFirst({
        where: { id: organizationId },
        include: { owner: { select: { email: true } } },
      })

      if (!org) {
        return Response.json({ success: false, message: "Organisatie niet gevonden." }, { status: 404 })
      }

      // Store in DB
      await db.contactInquiry.create({
        data: { name, email, subject: subject ?? "Contactformulier", message },
      })

      const recipientEmail = org.owner?.email ?? process.env.ADMIN_EMAIL ?? "info@hisarweb.be"
      const siteName = org.siteName ?? org.name

      // Send notification to org owner
      await getResend().emails.send({
        from: `${siteName} Contact <noreply@hisarweb.be>`,
        to: recipientEmail,
        replyTo: email,
        subject: `Nieuw bericht via ${siteName}: ${subject ?? "Contactformulier"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #6d28d9;">Nieuw contactbericht</h2>
            <p><strong>Van:</strong> ${name} (${email})</p>
            <p><strong>Bericht:</strong></p>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
              ${message.replace(/\n/g, "<br>")}
            </div>
            <hr>
            <p style="color: #666; font-size: 12px;">Via ${siteName} — HisarWeb</p>
          </div>
        `,
      })

      // Send confirmation to sender
      await getResend().emails.send({
        from: `${siteName} <noreply@hisarweb.be>`,
        to: email,
        subject: `Bedankt voor je bericht — ${siteName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Bedankt, ${name}!</h2>
            <p>We hebben je bericht ontvangen en nemen zo snel mogelijk contact op.</p>
            <p style="color: #666; font-size: 12px;">Dit is een automatisch bericht — je hoeft niet te antwoorden.</p>
          </div>
        `,
      })

      return Response.json({ success: true, message: "Bericht verzonden!" }, { headers: responseHeaders })
    }

    // 4b. Generic path (no org): use existing submission helper
    const result = await submitContactInquiry({
      name,
      email,
      subject: subject ?? "Contactformulier",
      message,
    })

    return Response.json(result, {
      status: result.success ? 200 : 400,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("[CONTACT_FORM]", error)
    return Response.json(
      {
        success: false,
        message: "Er is een fout opgetreden.",
      },
      { status: 500 }
    )
  }
}
