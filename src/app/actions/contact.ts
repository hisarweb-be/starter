"use server"

import { headers } from "next/headers"

import {
  checkRateLimit,
  getClientIdentifier,
  RATE_LIMITS,
} from "@/lib/server/rate-limiter"
import { submitContactInquiry } from "@/lib/server/contact-submission"

export async function submitContactInquiryAction(input: {
  name: string
  email: string
  subject: string
  message: string
}) {
  // Rate limiting
  const headersList = await headers()
  const clientIp = getClientIdentifier(headersList)
  const rateLimitResult = checkRateLimit(clientIp, RATE_LIMITS.contact)

  if (!rateLimitResult.success) {
    console.warn(`[SECURITY] Contact form rate limit exceeded for ${clientIp}`)
    return {
      success: false,
      message: "Te veel berichten verzonden. Probeer het later opnieuw.",
    }
  }

  return submitContactInquiry(input)
}
