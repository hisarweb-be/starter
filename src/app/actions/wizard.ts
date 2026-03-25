"use server"

import { auth } from "@/auth"
import { canManageSetup } from "@/lib/server/authorization-server"
import { saveWizardConfig } from "@/lib/server/wizard-store"
import { wizardConfigSchema, type WizardConfigInput } from "@/lib/wizard"

export async function saveWizardConfigAction(input: WizardConfigInput) {
  const setupComplete = process.env.NEXT_PUBLIC_SETUP_COMPLETE === "true"
  const session = await auth()
  const hasAccess = await canManageSetup(session)

  if (!hasAccess && setupComplete) {
    return {
      success: false,
      message: "De setup wizard is al vergrendeld. Meld aan als admin om wijzigingen te maken.",
    }
  }

  const parsed = wizardConfigSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Unable to save setup configuration",
    }
  }

  await saveWizardConfig(parsed.data)

  return {
    success: true,
    message: "Setup configuration saved successfully.",
  }
}
