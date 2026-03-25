import type { Session } from "next-auth"

export type AppRole = "superadmin" | "admin" | "editor" | "user"
export type AppPermission =
  | "dashboard:view"
  | "setup:manage"
  | "content:manage"
  | "requests:view"
  | "users:manage"
  | "system:manage"
  | "clients:manage"

const rolePermissionMap: Record<AppRole, AppPermission[]> = {
  superadmin: [
    "dashboard:view",
    "setup:manage",
    "content:manage",
    "requests:view",
    "users:manage",
    "system:manage",
    "clients:manage",
  ],
  admin: [
    "dashboard:view",
    "setup:manage",
    "content:manage",
    "requests:view",
    "users:manage",
    "system:manage",
  ],
  editor: ["dashboard:view", "content:manage", "requests:view"],
  user: [],
}

export function getSessionRole(session: Session | null | undefined): AppRole {
  const role = session?.user?.role
  return role === "superadmin" || role === "admin" || role === "editor" || role === "user" ? role : "user"
}

export function canManageClients(session: Session | null | undefined) {
  return hasPermission(session, "clients:manage")
}

export function getRolePermissions(role: AppRole) {
  return rolePermissionMap[role]
}

export function getSessionPermissions(session: Session | null | undefined) {
  return getRolePermissions(getSessionRole(session))
}

export function hasPermission(
  session: Session | null | undefined,
  permission: AppPermission
) {
  return getSessionPermissions(session).includes(permission)
}

export function hasDashboardAccess(session: Session | null | undefined) {
  return hasPermission(session, "dashboard:view")
}

export function canManageContent(session: Session | null | undefined) {
  return hasPermission(session, "content:manage")
}

export function canViewRequests(session: Session | null | undefined) {
  return hasPermission(session, "requests:view")
}

export function canManageUsers(session: Session | null | undefined) {
  return hasPermission(session, "users:manage")
}

export function canManageSystem(session: Session | null | undefined) {
  return hasPermission(session, "system:manage")
}

export function hasSetupAccess(
  session: Session | null | undefined,
  hasExistingSetup: boolean
) {
  if (!hasExistingSetup) {
    return true
  }

  return hasPermission(session, "setup:manage")
}
