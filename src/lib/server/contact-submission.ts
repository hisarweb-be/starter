import "server-only"

import { canSendEmail, sendTransactionalEmail } from "@/lib/email"
import { saveContactInquiry, contactInquirySchema } from "@/lib/server/contact-store"
import { getWizardConfig } from "@/lib/server/wizard-store"

export async function submitContactInquiry(input: {
  name: string
  email: string
  subject: string
  message: string
}) {
  const parsed = contactInquirySchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Please complete the contact form.",
    }
  }

  const inquiry = await saveContactInquiry(parsed.data)
  const wizard = await getWizardConfig()

  if (wizard?.adminEmail) {
    await sendTransactionalEmail({
      to: wizard.adminEmail,
      subject: `Nieuwe contactaanvraag: ${inquiry.subject}`,
      text: `Van: ${inquiry.name} <${inquiry.email}>\n\n${inquiry.message}`,
    })
  }

  return {
    success: true,
    message: canSendEmail()
      ? "Inquiry stored and email delivery attempted via Resend."
      : "Inquiry stored locally. Add RESEND_API_KEY to enable outbound email.",
  }
}
