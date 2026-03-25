import { Resend } from "resend"

import { env } from "@/lib/env"

export const emailConfig = {
  provider: "resend",
  apiKey: env.resendApiKey,
  defaultFrom: "HisarWeb <noreply@hisarweb.be>",
}

export function canSendEmail() {
  return Boolean(emailConfig.apiKey)
}

export async function sendTransactionalEmail({
  to,
  subject,
  text,
}: {
  to: string | string[]
  subject: string
  text: string
}) {
  if (!canSendEmail()) {
    return {
      delivered: false,
      reason: "missing-resend-api-key",
    }
  }

  const resend = new Resend(emailConfig.apiKey)

  await resend.emails.send({
    from: emailConfig.defaultFrom,
    to,
    subject,
    text,
  })

  return {
    delivered: true,
  }
}
