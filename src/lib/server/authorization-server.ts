import "server-only"

import type { Session } from "next-auth"

import {
  canManageContent,
  canManageSystem,
  canManageUsers,
  canViewRequests,
  hasDashboardAccess,
  hasSetupAccess,
} from "@/lib/server/authorization"
import { getWizardConfig } from "@/lib/server/wizard-store"

export async function canAccessDashboard(session: Session | null | undefined) {
  return hasDashboardAccess(session)
}

export async function canManageSetup(session: Session | null | undefined) {
  const existingConfig = await getWizardConfig()
  return hasSetupAccess(session, Boolean(existingConfig))
}

export async function canAccessContentManagement(session: Session | null | undefined) {
  return canManageContent(session)
}

export async function canAccessRequestManagement(session: Session | null | undefined) {
  return canViewRequests(session)
}

export async function canAccessUserManagement(session: Session | null | undefined) {
  return canManageUsers(session)
}

export async function canAccessSystemManagement(session: Session | null | undefined) {
  return canManageSystem(session)
}
