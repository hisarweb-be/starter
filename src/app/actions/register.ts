"use server"

import { sendTransactionalEmail } from "@/lib/email"
import {
  registrationRequestSchema,
  saveRegistrationRequest,
} from "@/lib/server/registration-store"
import { getWizardConfig } from "@/lib/server/wizard-store"

export async function submitRegistrationRequestAction(input: {
  name: string
  email: string
}) {
  const parsed = registrationRequestSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Complete all required fields.",
    }
  }

  const wizard = await getWizardConfig()

  if (!wizard?.allowRegistration) {
    return {
      success: false,
      message: "Registratie is momenteel niet geactiveerd voor deze site.",
    }
  }

  const request = await saveRegistrationRequest(parsed.data)

  await sendTransactionalEmail({
    to: wizard.adminEmail,
    subject: `Nieuwe registratieaanvraag voor ${wizard.siteName}`,
    text: `Nieuwe registratieaanvraag van ${request.name} <${request.email}>.`,
  })

  return {
    success: true,
    message: "Registratieaanvraag opgeslagen. Een beheerder neemt contact op zodra toegang actief is.",
  }
}
